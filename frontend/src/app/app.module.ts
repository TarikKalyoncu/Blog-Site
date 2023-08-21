import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/partials/header/header.component';
 
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterPageComponent } from './components/pages/register-page/register-page/register-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SidebarComponent } from './components/partials/sidebar/sidebar.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { SortByDatePipe } from './services/sort-by-date.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditUserDialogComponent } from './components/pages/edit-user-dialog/edit-user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';  
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { ToastrModule } from 'ngx-toastr';
import { CreatePostPageComponent } from './components/pages/create-post-page/create-post-page.component';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import { NgxCaptchaModule } from 'ngx-captcha';
import { RecaptchaModule } from "ng-recaptcha";
import {  RecaptchaFormsModule } from 'ng-recaptcha';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { DialogComponent } from './components/pages/dialog/dialog.component';
import { ConfirmdialogComponent } from './components/partials/confirmdialog/confirmdialog.component';
import { FullContentDialogComponent } from './components/partials/full-content-dialog/full-content-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SearchResultPageComponent } from './components/pages/search-result-page/search-result-page.component';
import { DetailPageComponent } from './components/pages/detail-page/detail-page.component';
import { BookmarkPageComponent } from './components/pages/bookmark-page/bookmark-page.component';
 

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginPageComponent,
    RegisterPageComponent,
    SidebarComponent,
    HomePageComponent,
    ProfileComponent,
    SortByDatePipe,
EditUserDialogComponent,
ContactPageComponent,
CreatePostPageComponent,
DashboardComponent,
DialogComponent,
ConfirmdialogComponent,
FullContentDialogComponent,
SearchResultPageComponent,
DetailPageComponent,
BookmarkPageComponent,
 


  
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule,HttpClientModule, BrowserAnimationsModule,MatDialogModule, MatFormFieldModule, MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    NgxCaptchaModule,
    CKEditorModule,
    RecaptchaModule,
    NgxPaginationModule,
    RecaptchaFormsModule,
    MatTableModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      newestOnTop: false,
    }),
    MatPaginatorModule,
    MatSortModule,
     ],
  providers: [   {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },

],
  bootstrap: [AppComponent],
})
export class AppModule {}
