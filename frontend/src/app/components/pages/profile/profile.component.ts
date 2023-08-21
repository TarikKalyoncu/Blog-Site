import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogPost, Status } from 'src/app/models/blogPost.model';
import { User } from 'src/app/models/user.model';
import { UserDetail } from 'src/app/models/userDetail.model';
import { getTimeElapsed } from 'src/app/services/time-util';
import { UserService } from 'src/app/services/user.service';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { FileTypeResult, fromBuffer } from 'file-type';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, forkJoin, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserResponse } from 'src/app/models/userResponse.model';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { BlogService } from 'src/app/services/blog.service';
import { BookmarkPageComponent } from '../bookmark-page/bookmark-page.component';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  postPhotos: { [key: number]: string } = {};
  userId!: number;
  postlength: number | undefined;
  userImagePath$: Observable<string> | undefined;
  userProfile: User[] = [];
  userDetails: UserDetail[] = [];
  blogPosts: BlogPost[] = [];
  userPhoto: { [key: number]: string } = {};  
  isUser: boolean | undefined = false;
  validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userFullImagePath: string | undefined;
  private userImagePathSubscription: Subscription | undefined;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private blogService: BlogService,
    
   
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];  
 
      this.userService.getUserProfile(this.userId).subscribe(
        (data) => {
          this.userProfile = [data];
          console.log(this.userProfile);  
        },
        (error) => {
          console.error(error);
        }
      );
    });

    this.getBlogPostsByUserId();
    this.getUserDetails();
    this.getUserPhoto(this.userId).subscribe((photo) => {
      this.userPhoto = photo;
    });
    this.getUserIdFromToken();

    this.userService.userId;
  }

  getTimeElapsed = getTimeElapsed;

  getUserDetails(): void {
    this.http
      .get<any>(`http://localhost:3000/user/detail/${this.userId}`)
      .subscribe(
        (data) => {
          this.userDetails = [data];
          console.log(this.userDetails);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  openBookmarkDialog( ) {
    const id =this.userId
    const dialogRef = this.dialog.open(BookmarkPageComponent, {
      width: '400px',
      data: { id }  
    });

    dialogRef.afterClosed().subscribe(result => {
     
    });
  }
  

  getBlogPostsByUserId(): void {
    this.http
      .get<any>(`http://localhost:3000/blog/posts/${this.userId}`)
      .subscribe(
        (data) => {
          this.blogPosts = data;
          this.postlength = this.blogPosts.length;
          console.log(this.blogPosts.length);

          const postIds = this.blogPosts.map((post) => post.id);


          this.getImagePhotos(postIds).subscribe((photos) => {
            this.postPhotos = photos;
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  storeClickedBlogPost(blogPost: BlogPost) {
    console.log(77, blogPost);
    this.blogService.setClickedBlogPost(blogPost);
  }

  getActiveFilteredBlogPosts(): BlogPost[] {
    if (!this.blogPosts || this.blogPosts.length === 0) {
      return [];  
    }

    
    const activeFilteredPosts = this.blogPosts.filter(
      (post) => post.status === Status.Active
    );
   
    this.postlength = activeFilteredPosts.length;

   

    return activeFilteredPosts;
  }

  getImagePhotos(userIds: number[]): Observable<{ [key: number]: string }> {
    const requests: Observable<{ id: number; imageUrl: string }>[] =
      userIds.map((userId) => {
        const url = `http://localhost:3000/blog/images/${userId}`;
        return this.http.get(url, { responseType: 'blob' }).pipe(
          map((response: Blob) => ({
            id: userId,
            imageUrl: URL.createObjectURL(response),
          }))
        );
      });

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

  openEditUserDialog(): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',  
      data: {
        userDetail: this.userDetails[0],  
        editMode: true,  
      },
    });

     
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
         
      }
    });
  }

  onFileSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement) {
      this.showErrorMessage('Input element not found.');
      return;
    }

    const file: File | null = inputElement.files?.[0] || null;
    if (!file) {
      this.showErrorMessage('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    this.userService.uploadUserImage(formData).subscribe(
      (response) => {
        this.getUserPhoto(this.userId).subscribe((photo) => {
          this.userPhoto = photo;
        });

        this.showSuccessMessage('File uploaded successfully');

       
      },
      (error) => {
        
        this.showErrorMessage('Error uploading file: ' + error);
      }
    );

   
    inputElement.value = '';
  }

  
  private showSuccessMessage(message: string): void {
    this.toastr.success(message, 'Success');
  }

  private showErrorMessage(message: string): void {
    this.toastr.error(message, 'Error');
  }

  getUserPhoto(userId: number): Observable<string> {
    const url = `http://localhost:3000/blog/selamlar/${userId}`;

    return this.http
      .get(url, { responseType: 'blob' })
      .pipe(map((response: Blob) => URL.createObjectURL(response)));
  }

  private getUserIdFromToken(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      return undefined;
    }

    const decodedToken: UserResponse = jwt_decode(token);
    if (decodedToken.user) {
      console.log(9, this.userId);
      console.log(9, decodedToken.user.id);
      console.log(9, this.isUser);
      if (this.userId == decodedToken.user.id) {
        this.isUser = true;
        console.log(9, this.isUser);
      }
    }

    return undefined;
  }


  
}
