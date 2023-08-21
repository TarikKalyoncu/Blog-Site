import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, take, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import jwt_decode from 'jwt-decode';
import { UserResponse } from '../models/userResponse.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment.prod';
import { Router } from '@angular/router';
import { NewUser } from '../models/newUser.model';
import { HttpClientModule } from '@angular/common/http';
import { BlogPost } from '../models/blogPost.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private user$ = new BehaviorSubject<User>(null!);
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {}

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };


  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isUserAuthenticated = user !== null;
        return of(isUserAuthenticated);
      })
    );
  }


  get userId(): Observable<User > {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        return of(user);
      })
    );
  }
  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user && user.firstName && user.lastName) {
          const fullName = user.firstName + ' ' + user.lastName;
          return of(fullName);
        } else {
          return of(''); // Kullanıcı verisi veya ad/soyad yoksa boş döndürüyoruz
        }
      })
    );
  }
  
  getUserFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
     switchMap((user: User) => {
       if (user) {
         const fullName = user.firstName + ' ' + user.lastName;
         return of(fullName);
       }
       return of(''); // Kullanıcı verisi yoksa boş döndürüyoruz
     })
   );
 }
 
  

  get userFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHaveImage = !!user?.imagePath;
        console.log(888, doesAuthorHaveImage, user);
        let fullImagePath = this.getDefaultFullImagePath();
        if (doesAuthorHaveImage) {
          fullImagePath = this.getFullImagePath(user.imagePath);
        }
        return of(fullImagePath);
      })
    );
  }

  

  getCurrentUserObservable(): Observable<User | null> {
    return this.user$.asObservable();
  }
  getDefaultFullImagePath(): string {
    return 'http://localhost:3000/api/feed/image/blank-profile-picture.png';
  }

  getFullImagePath(id: string): string {
    return 'http://localhost:3000/user/'+ id;
  }


  
  get userStream(): Observable<User> {
    return this.user$.asObservable();
  }

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http
      .get<{ imageName: string }>(`${environment.baseApiUrl}/user/image-name`)
      .pipe(take(1));
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath;
        this.user$.next(user);
        return user;
      })
    );
  }

  uploadUserImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/blog/upload`,
        formData
      )
      .pipe(
        tap(({ modifiedFileName }) => {
          let user = this.user$.value;
          user.imagePath = modifiedFileName;
          this.user$.next(user);
        })
      );
  }
  uploadBlogImage(
    formData: FormData
  ): Observable<{ modifiedFileName: string }> {
    return this.http
      .post<{ modifiedFileName: string }>(
        `${environment.baseApiUrl}/blog/image`,
        formData
      )  
  }

  get isAdmin(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const isAdminUser = user && user.id === 11;  
        return of(isAdminUser);
      })
    );
  }


  isTokenInStorage(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }

    const decodedToken: UserResponse = jwt_decode(token);
    const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
    const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch);

    if (isExpired) {
      return of(false);
    }

    if (decodedToken.user) {
      this.user$.next(decodedToken.user);
      return of(true);
    }

    return of(false);
  }


  getUserProfile(userId: number): Observable<any> {
    const url = `${environment.baseApiUrl}/blog/profile/${userId}`;
    return this.http.get<any>(url);
    
  }

  getDefaultProfileImage(): string {
    
    return '../../../../assets/default-profile-image.jpg';  
  }



  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(
        `${environment.baseApiUrl}/auth/login`,
        { email, password },
        this.httpOptions
      )
      .pipe(
        take(1),
        tap((response: { token: string }) => {
          localStorage.setItem('token', response.token);
          const decodedToken: UserResponse = jwt_decode(response.token);
          this.user$.next(decodedToken.user);
          console.log(decodedToken.user.lastName)
          this.toastr.success(`Hoş geldiniz, ${decodedToken.user.firstName}!`, 'Başarılı');
        })
      );
  }


  createBlogPost(blogPost: BlogPost): Observable<BlogPost> {
    return this.http.post<BlogPost>(`${environment.baseApiUrl}/blog`, blogPost);
  }




  register(newUser: NewUser): Observable<User> {
    return this.http
      .post<User>(
        `${environment.baseApiUrl}/auth/register`,
        newUser,
        this.httpOptions
      )
      .pipe(
        switchMap((user: User) => {
        
          return this.login(newUser.email, newUser.password).pipe(
            map(() => user)
          );
        }),
        tap(() => {
      
        }),
        catchError((error) => {
          this.toastr.error('Kayıt işlemi sırasında bir hata oluştu.', 'Hata');
          return throwError(error);
        })
      );
  }

  logout(): void {
    
    this.user$.next(null!);
    localStorage.removeItem('token');
    this.router.navigateByUrl('/auth');
  }















}


