import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './components/pages/register-page/register-page/register-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { ContactPageComponent } from './components/pages/contact-page/contact-page.component';
import { CreatePostPageComponent } from './components/pages/create-post-page/create-post-page.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { AdminGuard } from './services/admin.guard';
import { SearchResultPageComponent } from './components/pages/search-result-page/search-result-page.component';
import { DetailPageComponent } from './components/pages/detail-page/detail-page.component';

const routes: Routes = [
  {path:'',component:HomePageComponent},
  {path: 'blog/:category', component: HomePageComponent },
  {path:'blog/profile/:id',component:ProfileComponent},
  {path:'blog/contact/send-email',component:ContactPageComponent},
  {path:'blog/admin/panel', component: DashboardComponent, canActivate: [AdminGuard] },
  {path:'blog/create/post',component:CreatePostPageComponent},
  {path:'auth/register',component:RegisterPageComponent},
  {path:'auth/login',component:LoginPageComponent},
  {path:'blog/search/:searchTerm',component:SearchResultPageComponent},
  {path:'blog/detail/:tittle/:id',component:DetailPageComponent},
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
