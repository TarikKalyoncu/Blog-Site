import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost, Status } from 'src/app/models/blogPost.model';
import { UserResponse } from 'src/app/models/userResponse.model';
import { BlogService } from 'src/app/services/blog.service';
import { getTimeElapsed } from 'src/app/services/time-util';
import jwt_decode from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, catchError, forkJoin, map, of } from 'rxjs';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})

export class HomePageComponent implements OnInit, OnDestroy {
  blogPosts: BlogPost[]  = [];
  category: string = '';
  filteredBlogPosts: BlogPost[] = [];
  userPhotos: { [key: number]: string } = {};
  postPhotos: { [key: number]: string } = {};
  POSTS: any;
  page: number = 1;
  count: number = 0;

  private routerSubscription!: Subscription;
  


  constructor(private blogService: BlogService, private route: ActivatedRoute, private http: HttpClient) {
    this.fetchPosts();
  }



  


  fetchPosts(): void {
    this.routerSubscription = this.route.params.subscribe((params) => {
      this.category = params['category'];
      this.blogService.getAllBlogPosts().subscribe((data: BlogPost[]) => {
        this.blogPosts = data;
        this.filteredBlogPosts = this.category
          ? this.blogPosts.filter((post) => post.technology === this.category)
          : this.blogPosts;
          
        const userIds = this.filteredBlogPosts.map((post) => post.user!.id );
        const postIds = this.filteredBlogPosts.map((post) => post.id );

        this.getUserPhotos(userIds).subscribe((photos) => {
          this.userPhotos = photos;
        });

        this.getImagePhotos(postIds).subscribe((photos) => {
          this.postPhotos = photos;
        });
      });
    });
  }



  onTableDataChange(event: any) {
    this.page = event;
    this.fetchPosts();
  }








  storeClickedBlogPost(blogPost: BlogPost) {
    console.log(77,blogPost)
    this.blogService.setClickedBlogPost(blogPost);
  }





  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  getTimeElapsed = getTimeElapsed;

  getUserProfileLink(id: number): string {
    return '/blog/profile/' + id;
  }

  
  getActiveFilteredBlogPosts(): BlogPost[] {
    if (!this.filteredBlogPosts || this.filteredBlogPosts.length === 0) {
      return [];  
    }
  
    
    return this.filteredBlogPosts.filter(post => post.status === Status.Active);
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
        });
        return photos;
      })
    );
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