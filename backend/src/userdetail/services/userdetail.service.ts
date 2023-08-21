import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDetailEntity } from '../models/userdetail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable, from, map } from 'rxjs';
import { UserEntity } from 'src/auth/models/user.entity';
import { BlogPostEntity } from 'src/blogpost/models/blogpost.entity';
@Injectable()
export class UserDetailService {
    constructor(

        @InjectRepository(UserDetailEntity)
        private readonly userDetailRepository: Repository<UserDetailEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(BlogPostEntity) private readonly blogPostRepository: Repository<BlogPostEntity>,

     
      ) {}

    createDetail(detail: UserDetailEntity): Observable<UserDetailEntity> {
        return from(this.userDetailRepository.save(detail));
      }

 
 findUserDetailByUserId(userId: number): Observable<UserDetailEntity> {
    return from(this.userDetailRepository.findOne({ where: { user: { id: userId } } }));
  }


  updateUserDetail(updatedUserDetail: UserDetailEntity): Observable<UserDetailEntity> {
    return from(this.userDetailRepository.update(updatedUserDetail.id, updatedUserDetail)).pipe(
      map(() => updatedUserDetail),
    );
  }

  async saveLikedBlogPost(userId:number,blogPostId: number): Promise<void> {
    const userDetail = await this.userDetailRepository.findOne({
      where: { user: { id: userId } }
       
    });
  
    if (!userDetail) {
      throw new NotFoundException('User Detail not found');
    }
  
    
     
     
  
      userDetail.likedBlogPosts.push(blogPostId);
      await this.userDetailRepository.save(userDetail);
    
  }
  


  async unsaveLikedBlogPost(userId: number, blogPostId: number): Promise<void> {
    const userDetail = await this.userDetailRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!userDetail) {
      throw new NotFoundException('User Detail not found');
    }

     
    const blogIndex = userDetail.likedBlogPosts.indexOf(blogPostId);
    if (blogIndex !== -1) {
      userDetail.likedBlogPosts.splice(blogIndex, 1);
      await this.userDetailRepository.save(userDetail);
    }
}


async checkIfBlogPostIsBookmarked(userId: number, blogPostId: any): Promise<{ isBookmarked: boolean }> {
  const userDetail = await this.userDetailRepository.findOne({
    where: { user: { id: userId } }
  });

  if (!userDetail) {
    throw new NotFoundException('User Detail not found');
  }
  
  const parsedBlogPostId = parseInt(blogPostId, 10);  
  if (isNaN(parsedBlogPostId)) {
    throw new BadRequestException('Invalid Blog Post ID');
  }

  const isBookmarked = userDetail.likedBlogPosts.some(id => id === parsedBlogPostId);

  return { isBookmarked };
}







 
}

 
 