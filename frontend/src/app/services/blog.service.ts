import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blogPost.model';
import { environment } from '../environments/environment.prod';
import { comment } from '../models/comment.model';


@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private backendApiUrl = `${environment.baseApiUrl}/blog`;  
  private clickedBlogPost: BlogPost | undefined;

  constructor(private http: HttpClient) {}

  getAllBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(this.backendApiUrl);
  }

  showUpdateButton: boolean = false;

  deleteItemApi(id: number): Observable<any> {
    const url = `${this.backendApiUrl}/${id}`;  
    return this.http.delete(url);
  }


updateItemApi(post: BlogPost): Observable<any> {
  const url = `${this.backendApiUrl}/${post.id}`; 
  return this.http.put(url, post);
}

setClickedBlogPost(blogPost: BlogPost) {
  this.clickedBlogPost = blogPost;
}

getClickedBlogPost() {
  return this.clickedBlogPost;
}


getCommentsForBlogPost(blogPostId: number): Observable<comment[]> {
  const url = `http://localhost:3000/comment/${blogPostId}`;
  return this.http.get<comment[]>(url);
}

getBlogPostByTitle(id: number): Observable<any> {
  const url = `http://localhost:3000/blog/detail/${id}`; 
  return this.http.get(url);
}
  
getLikedBlogPosts(ids: number[]) {
  console.log(929,ids)
  const url = `http://localhost:3000/blog/liked`;  
  return this.http.post(url, { ids });  
}


saveLikedBlogPost(blogPostId: number): Observable<any> {
  const url = `http://localhost:3000/user/bookmark`;  
  const body = { blogPostId };  

  return this.http.post(url, body);
}


unsaveLikedBlogPost(blogPostId: number): Observable<any> {
  const url = `http://localhost:3000/user/unbookmark`;  
  const body = { blogPostId };  
  return this.http.post(url, body);
}

checkIfBlogPostIsBookmarked(blogPostId: number): Observable<{ isBookmarked: boolean }> {
  const url = `http://localhost:3000/user/check-bookmark/${blogPostId}`;  

  return this.http.get<{ isBookmarked: boolean }>(url);
}



}
