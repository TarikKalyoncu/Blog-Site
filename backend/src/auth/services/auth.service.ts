import {  Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  hashPassword(password: string): Observable<string> {
    return from(bcrypt.hash(password, 12));
  }

  registerAccount(user: User): Observable<User> {
    const { firstName, lastName, email, password, imagePath } = user;
     
  
    console.log(user);
    return this.hashPassword(password).pipe(
      switchMap((hashedPassword: string) => {
        return from(
          this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            imagePath, // imagePath'i kaydetmeyi unutmayın
          })
        ).pipe(
          map((user: User) => {
            delete user.password;
            return user;
          }),
          catchError((error) => {
            console.error('Kayıt işlemi sırasında bir hata oluştu:', error);
             
            return throwError('Kayıt işlemi başarısız oldu.');
          })
        );
      }),
      catchError((error) => {
        console.error('Hashleme işlemi sırasında bir hata oluştu:', error);
      
        return throwError('Hashleme işlemi başarısız oldu.');
      })
    );
  }
  
  validateUser(email: string, password: string): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: {
          email: email,  
        },
        select: ['id', 'firstName', 'lastName', 'email', 'password','imagePath'], 
      })
    ).pipe(
      switchMap((user: User) =>
        from(bcrypt.compare(password, user.password)).pipe(
          map((isValidPassword: boolean) => {
            if (isValidPassword) {
              delete user.password;
              return user;
            }
          }),
        ),
      ),
    );
  }
  
  
  login(user: User): Observable<string> {
    const { email, password } = user;
    return this.validateUser(email, password).pipe(
      switchMap((user: User) => {
        if (user) {
         
          return from(this.jwtService.signAsync({ user }));
        } else {
          
          return throwError('Invalid credentials');
        }
      }),
    );
  }




//eturn from(this.jwtService.signAsync({ user })); ifadesi, jwtService üzerindeki signAsync yöntemini çağırır ve { user } nesnesini parametre olarak geçer. Bu yöntem, kullanıcı bilgilerini içeren bir JWT oluşturur.

//

}
