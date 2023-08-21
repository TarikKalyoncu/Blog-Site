import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { BlogPost } from 'src/app/models/blogPost.model';
import { comment } from 'src/app/models/comment.model';
import { UserResponse } from 'src/app/models/userResponse.model';
import { BlogService } from 'src/app/services/blog.service';
import jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { SafeHtml } from '@angular/platform-browser';
import { DomSanitizer } from '@angular/platform-browser';
 
@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent {
  clickedBlogPost: BlogPost | undefined;
  blogPhotoUrl: string | undefined;
  userPhotoUrl: string | undefined;
  isLoggedIn: boolean = false;
  contentFromDatabase: string = '<p>dfbdfbdfbdsfvfdvb</p>';
  blogContent: string = '';
  userIds!: number[];
  isBookmarked: boolean | undefined;
  comments: comment[] = [];
  blogId!: number  
  commentlength: number | undefined;
  isUser: boolean | undefined = false;
  userPhotos: { [key: number]: string } = {};
  commentForm!: FormGroup ;
  constructor(private blogService: BlogService, private route: ActivatedRoute, private http: HttpClient,private formBuilder: FormBuilder,  private userService: UserService, private toastr: ToastrService, private sanitizer: DomSanitizer ) {


    this.commentForm = this.formBuilder.group({
      subject: ['', [Validators.required, Validators.maxLength(40)]],  
      detail: ['', [Validators.required, Validators.maxLength(1000)]]   
    });


      
  }






  



  ngOnInit() {
      this.route.params.subscribe(params => {
      this.blogId = params['id'];  
      console.log( this.blogId )
      this.blogService.getBlogPostByTitle( this.blogId ).subscribe(
        (blogPost: BlogPost) => {
          this.clickedBlogPost = blogPost;
          console.log(this.clickedBlogPost)
          this.blogContent = blogPost.content;
           
          this.blogService.checkIfBlogPostIsBookmarked(this.blogId).subscribe(
            (response) => {
              console.log(2, response.isBookmarked)
              this.isBookmarked = response.isBookmarked;  
            },
            (error) => {
              console.error('Hata:', error);
            }
          );



          if (this.blogId) {
            this.getImagePhotos(this.blogId).subscribe((photos) => {
              this.blogPhotoUrl = photos[this.blogId!];
      
              
            });
          }
       
          if (this.blogId) {
            this.blogService.getCommentsForBlogPost(this.blogId).subscribe((comments) => {
              this.comments = comments;
            
              this.commentlength=comments.length
              const commentIds = this.comments.map((post) => post.user!.id );
              this.userIds=this.comments.map((post) => post.user!.id );
              
              this.getUserPhotoss(commentIds).subscribe((photos) => {
                this.userPhotos = photos;
              });
              console.log( this.comments)
            });
        
          }
       
          const userId = this.clickedBlogPost!.user!.id;
          console.log(5,userId)
          if (this.blogId) {
            this.getUserPhotos(userId).subscribe((photo) => {
              this.userPhotoUrl = photo[userId];
            });
          }
         
          
          const token = localStorage.getItem('token');
          if (token) {
            const decodedToken: UserResponse = jwt_decode(token);
            const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
            const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);
            this.isLoggedIn = !isExpired;
          } 





           









        }
      );
    });



   
    
 

   

  
  }
  
  saveLikedBlogPost(blogPostId: number) {
   
    this.blogService.saveLikedBlogPost(blogPostId).subscribe(
      (response) => {
        this.isBookmarked = !this.isBookmarked;
        this.toastr.success('Gönderi başarıyla kaydedildi', 'Başarılı');
 
      },
      (error) => {
         
        console.error('Hata:', error);
      }
    );
  }

  unsaveLikedBlogPost(blogPostId: number) {
   
    this.blogService.unsaveLikedBlogPost(blogPostId).subscribe(
      (response) => {
        this.isBookmarked = !this.isBookmarked;
        this.toastr.info('Gönderi kaydedilmesi kaldırıldı', 'Bilgi');
       
      },
      (error) => {
       
        console.error('Hata:', error);
      }
    );
  }
  

   

  
  toggleBookmark(id:number) {
    if (this.isBookmarked) {
      // Unsave işlemi yapılacak
      this.unsaveLikedBlogPost(id);
    } else {
      // Save işlemi yapılacak
      this.saveLikedBlogPost(id);
    }
  }
















  get sanitizeHtml(): SafeHtml {
    console.log()
 
    return this.sanitizer.bypassSecurityTrustHtml(this.blogContent);
  }

  getUserPhotoss(userIds: number[]): Observable<{ [key: number]: string }> {
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






  
  getUserPhotos(userId: number): Observable<{ [key: number]: string }> {
    const url = `http://localhost:3000/blog/${userId}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((response: Blob) => ({
        [userId]: URL.createObjectURL(response),
      })),
    );
  }

  getUserProfileLink(id: number): string {
    return '/blog/profile/' + id;
  }







  getImagePhotos(userId: number): Observable<{ [key: number]: string }> {
    const url = `http://localhost:3000/blog/images/${userId}`;
    return this.http.get(url, { responseType: 'blob' }).pipe(
      map((response: Blob) => ({
        [userId]: URL.createObjectURL(response),
      })),
    );
  }






  addComment() {
    if (this.commentForm.valid) {
      const newComment: Comment = this.commentForm.value;
  
      this.http.post('http://localhost:3000/blog/' + this.blogId + '/comment', newComment)
        .subscribe(
          (response: any) => {
            console.log('Yorum başarıyla eklendi:', response);
  
            // Toastr mesajını göster
            this.toastr.success('Yorum başarıyla eklendi.', 'Başarılı');
  
            // Formu sıfırla
            this.commentForm.reset();
          },
          (error: any) => {
            console.error('Yorum eklenirken bir hata oluştu:', error);
  
            // Toastr mesajını göster
            this.toastr.error('Yorum eklenirken bir hata oluştu.', 'Hata');
          }
        );
    }
  }





  deleteComment(commentId: number) {
    this.http.delete('http://localhost:3000/comment/' + commentId).subscribe(
      (response: any) => {
        console.log('Yorum başarıyla silindi:', response);
  
        this.comments = this.comments.filter(comment => comment.id !== commentId);
  
        // Toastr mesajını göster
        this.toastr.success('Yorum başarıyla silindi.', 'Başarılı');
      },
      (error: any) => {
        console.error('Yorum silinirken bir hata oluştu:', error);
  
        // Toastr mesajını göster
        this.toastr.error('Yorum silinirken bir hata oluştu.', 'Hata');
      }
    );
  }
 
  isUserOwner(commentUserId: number): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
  
    const decodedToken: UserResponse = jwt_decode(token);
    if (decodedToken.user && decodedToken.user.id === commentUserId) {
      return true;
    }
  
    return false;
  }
  
  














}



















