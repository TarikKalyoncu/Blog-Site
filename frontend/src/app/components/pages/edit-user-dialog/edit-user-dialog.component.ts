// edit-user-dialog.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserDetail } from 'src/app/models/userDetail.model';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.css']
})
export class EditUserDialogComponent implements OnInit {

  editMode: boolean = false;
  userForm: FormGroup = new FormGroup({
    occupation: new FormControl(''),
    youtubeLink: new FormControl(''),
    twitterLink: new FormControl(''),
    instagramLink: new FormControl(''),
    linkedinLink: new FormControl(''),
    aboutMe: new FormControl('')
  });

  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private formBuilder: FormBuilder,private fb: FormBuilder,private http: HttpClient, private userService:UserService,private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { userDetail: UserDetail, editMode: boolean }
  ) { }

  ngOnInit(): void {
    this.editMode = this.data.editMode;

    this.userForm = this.fb.group({
     
      occupation: [this.data.userDetail.occupation, Validators.required],
      aboutMe: [this.data.userDetail.aboutMe, Validators.maxLength(500)],
      youtubeLink: [this.data.userDetail.youtubeLink],
      twitterLink: [this.data.userDetail.twitterLink],
      instagramLink: [this.data.userDetail.instagramLink],
      linkedinLink: [this.data.userDetail.linkedinLink]
    });
    console.log(this.userForm.value)
   
  }

  onSave(): void {

    if (this.userForm.valid) {
      const updatedUser: UserDetail = {
        ...this.data.userDetail,

        occupation: this.userForm.value.occupation,
        youtubeLink: this.userForm.value.youtubeLink,
        twitterLink: this.userForm.value.twitterLink,
        instagramLink: this.userForm.value.instagramLink,
        linkedinLink: this.userForm.value.linkedinLink,
        aboutMe: this.userForm.value.aboutMe
      };
      this.userService.isTokenInStorage().subscribe((isLoggedIn: boolean) => {
        console.log(isLoggedIn)
        });
      const url = `http://localhost:3000/user/profile`;
      this.http.post(url, updatedUser).subscribe(
        
        (response) => {
        
          this.dialogRef.close();
     
        },
        (error) => {
       
        }
        );


    
        location.reload();

       

    }
    this.toastr.success('Düzenleme Başarılı!', 'Başarılı');
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
