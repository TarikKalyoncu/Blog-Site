import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewUser } from 'src/app/models/newUser.model';
import { User } from 'src/app/models/user.model';
import { passwordMatchValidatorService } from 'src/app/services/passwordMatchValidatorService.service';
import { usernameValidator } from 'src/app/services/regexValidator';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {


  public signupForm!: FormGroup
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private match: passwordMatchValidatorService) { }
 
  emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
  pwdPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({

    
      firstName: ["", usernameValidator],
      lastName: ["",],
      email: ["", Validators.pattern(this.emailPattern)],
      password: ["", [Validators.required, Validators.pattern(this.pwdPattern)]],
      confirmpassword: [""],
       
    
    
    },
      {
        
        validator: this.match.passwordMatchValidator('password', 'confirmpassword')
      }
    )
  }
   
  register() {
    const imagePath = "profile.jpg";
    const { firstName, lastName, email, password } = this.signupForm.value;
    console.log(this.signupForm.value);
  
    const newUser: User = {
      firstName, lastName, email, password, imagePath,
      id:0
    };
  
    return this.userService.register(newUser).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
  



}
