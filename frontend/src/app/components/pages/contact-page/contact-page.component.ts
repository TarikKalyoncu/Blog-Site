import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {
  toEmail: string;
  subject: string ;
  message: string ;
  name:string;
  user!:User;
  userFullName: string = '';
  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
  form: FormGroup;
  constructor(private userService:UserService,private http: HttpClient,private toastr: ToastrService,private fb: FormBuilder) {
    
    this.toEmail = '';
    this.subject = '';
    this.message = '';
    this.name='';
    this.form = this.fb.group({
      name: [this.name, Validators.required],
      toEmail: ['', [Validators.required,Validators.pattern(this.emailPattern)]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });

    this.userService.userFullName.subscribe((fullName) => {
      this.userFullName = fullName;

      console.log(fullName)
    });


    
   
   }

   ngOnInit() {
    this.userService.userFullName.subscribe((fullName) => {
      if (fullName) {
        this.userFullName = fullName;
        this.name = this.capitalizeFirstLetter(this.userFullName);
  
        this.form = this.fb.group({
          name: [this.name, Validators.required],
          toEmail: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
          subject: ['', Validators.required],
          message: ['', Validators.required]
        });
      }
      console.log(this.toEmail)
    });
  }
  
  
  hasError(controlName: string, errorName: string) {
    const control = this.form.get(controlName);
    return control && control.hasError(errorName);
  }




  
  capitalizeFirstLetter(name: string): string  {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  
   sendEmail() {
    
 
    const { name, toEmail, subject, message } = this.form.value;
    
    console.log(this.form.value.toEmail)

    this.http.post<any>('http://localhost:3000/blog/contact/send-email', this.form.value).subscribe(
      (response) => {
        console.log(response);
        
        this.toastr.success('Email sent successfully', 'Success');
      
      },
      (error) => {
        console.error(error);
        this.toastr.error('An error occurred while sending the email', 'Error');
      }
    );
  }

}
