import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userService.getCurrentUserObservable()
      .pipe(
        map(user => {
          if (user && user.id === 11) {
            console.log(user.id);
            this.toastr.success('Admin sayfasına başarıyla erişildi!', 'Başarılı');
            return true;
          } else {
            this.toastr.error('Bu sayfaya erişim izniniz yok.', 'Hata');
            this.router.navigate(['/blog', 'angular']);
            return false;
          }
        })
      );
  }
}
