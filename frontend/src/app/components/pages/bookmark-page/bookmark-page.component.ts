import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BlogPost } from 'src/app/models/blogPost.model';
import { UserDetail } from 'src/app/models/userDetail.model';
import { BlogService } from 'src/app/services/blog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bookmark-page',
  templateUrl: './bookmark-page.component.html',
  styleUrls: ['./bookmark-page.component.css']
})
export class BookmarkPageComponent {

  userId!: number;
  userDetails: UserDetail[] = [];
  likedBlogPosts: number[] = [];
  blogPosts: BlogPost[] = [];
  constructor(public dialogRef: MatDialogRef<BookmarkPageComponent>,  private userService: UserService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private toastr: ToastrService,
    
    private blogService: BlogService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number } ) { }






  ngOnInit(): void {
    this.userId = this.data.id;

    this.http
      .get<any>(`http://localhost:3000/user/detail/${this.userId}`)
      .subscribe(
        (data) => {
          this.userDetails = [data];
           
            this.likedBlogPosts = this.userDetails[0].likedBlogPosts;
            console.log( 91,this.userDetails[0].likedBlogPosts)
          
          


            console.log(13,this.userDetails[0].likedBlogPosts)
            this.blogService.getLikedBlogPosts(this.userDetails[0].likedBlogPosts).subscribe(
              (response: any) => {
                this.blogPosts = response;
                console.log(4,this.blogPosts)  
              },
              (error) => {
               
                console.error('Hata:', error);
              }
            );
   
        },
        (error) => {
          console.error(error);
        }
      );
      
    
      





  }


  getUserDetails(): void {
     
  }



 

  



  closeModal() {
    this.dialogRef.close();  
  }
}
