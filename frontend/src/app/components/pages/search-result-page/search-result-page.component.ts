import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { BlogPost, Status } from 'src/app/models/blogPost.model';
import { BlogService } from 'src/app/services/blog.service';
import { getTimeElapsed } from 'src/app/services/time-util';
@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrls: ['./search-result-page.component.css']
})
export class SearchResultPageComponent {
  searchResults: BlogPost[] = [];
  userPhotos: { [key: number]: string } = {};
  searchTerm:string | undefined;
  searchlenght:number|undefined;
  page: number = 1;
  count: number = 0;
  postPhotos: { [key: number]: string } = {};
  constructor(private route: ActivatedRoute,private http: HttpClient ,private blogService: BlogService) {



    
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const searchTerm = params['searchTerm'];
      this.searchTerm=searchTerm
      
      console.log(7,searchTerm)
      this.fetchSearchResults(searchTerm);
    });


  
  }

  getTimeElapsed = getTimeElapsed;


  getUserProfileLink(id: number): string {
    return '/blog/profile/' + id;
  }


  getUserPhotos(userIds: number[]): Observable<{ [key: number]: string }> {
    const requests: Observable<{ id: number; imageUrl: string }>[] = userIds.map(
      (userId) => {
        const url = `http://localhost:3000/blog/${userId}`;
        return this.http.get(url, { responseType: 'blob' }).pipe(
          map((response: Blob) => ({
            id: userId,
            imageUrl: URL.createObjectURL(response),
          })),
        );
      }
    );

    return forkJoin(requests).pipe(
      map((results) => {
        const photos: { [key: number]: string } = {};
        results.forEach((result) => {
          photos[result.id] = result.imageUrl;
          console.log(photos[result.id])
        });
        return photos;
      })
    );
  }



  storeClickedBlogPost(blogPost: BlogPost) {
    console.log(77,blogPost)
    this.blogService.setClickedBlogPost(blogPost);
  }




  fetchSearchResults(searchTerm: string): void {
 
    const url = `http://localhost:3000/blog/search/${searchTerm}`;
    this.http.get<BlogPost[]>(url).subscribe(
      (results: BlogPost[]) => {
        console.log(results);
        this.searchResults = results;
       
        const userIds = this.searchResults.map((post) => post.user!.id );
        const postIds = this.searchResults.map((post) => post.id );
    console.log(userIds)
    this.getUserPhotos(userIds).subscribe((photos) => {
      this.userPhotos = photos;
    });


    
    this.getImagePhotos(postIds).subscribe((photos) => {
      this.postPhotos = photos;
    });


      },



      
      (error) => {
        console.error('An error occurred:', error);
      }
    );
  }



  getActiveFilteredBlogPosts(): BlogPost[] {
    if (!this.searchResults || this.searchResults.length === 0) {
      return []; 
    }
  
   
    const activeFilteredPosts = this.searchResults.filter(post => post.status === Status.Active);
    
   
    this.searchlenght = activeFilteredPosts.length;
  
    return activeFilteredPosts;
  }
  





  onTableDataChange(event: any) {
    this.page = event;
    this.getActiveFilteredBlogPosts();
  }









  getImagePhotos(userIds: number[]): Observable<{ [key: number]: string }> {
    const requests: Observable<{ id: number; imageUrl: string }>[] = userIds.map(
      (userId) => {
        const url = `http://localhost:3000/blog/images/${userId}`;
        return this.http.get(url, { responseType: 'blob' }).pipe(
          map((response: Blob) => ({
            id: userId,
            imageUrl: URL.createObjectURL(response),
          })),
        );
      }
    );

    return forkJoin(requests).pipe(
      map((results) => {
        const photos: { [key: number]: string } = {};
        results.forEach((result) => {
          photos[result.id] = result.imageUrl;
        });
        return photos;
      })
    );
  }


















}
