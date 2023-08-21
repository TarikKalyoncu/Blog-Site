import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  findUserById(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: {
          id,
        },
  
      }),
    ).pipe(
      map((user: User) => {
        if (user) {
          delete user.password;
          return user;
        } else {
          throw new Error('User not found'); 
        }
      }),
    );
  }






  

  updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
    const user: User = new UserEntity();
    user.id = id;
    user.imagePath = imagePath;
    return from(this.userRepository.update(id, user));
  }
   

  findImageNameByUserId(id: number): Observable<string> {
    const options: FindOneOptions<UserEntity> = {
      where: { id },  
      select: ['imagePath'],  
    };
   
    return from(this.userRepository.findOne(options)).pipe(
      map((user: UserEntity | undefined) => {
        if (user) {
          console.log(user.imagePath);
          return user.imagePath;
        } else {
          throw new Error('User not found');  
        }
      }),
    );
  }
}
