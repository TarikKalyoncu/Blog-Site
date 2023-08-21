import { Injectable, NotFoundException } from "@nestjs/common";
import { BlogPostEntity } from "../models/blogpost.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogPost } from "../models/blogpost.interface";
import { DeleteResult, FindOneOptions, Repository, UpdateResult } from "typeorm";

import { Observable, catchError, from, map  } from "rxjs";
import { User } from "src/auth/models/user.interface";
@Injectable()
export class BlogPostService {
    constructor(
        @InjectRepository(BlogPostEntity)
        private readonly blogPostRepository: Repository<BlogPostEntity>,
      ) {}
    
      createPost(user: User, blogpost: BlogPost): Observable<BlogPost> {
        blogpost.user = user; 
        
        return from(this.blogPostRepository.save(blogpost));
      }


      updatePost(id: number, blogpost: BlogPost): Observable<UpdateResult> {
        return from(this.blogPostRepository.update(id, blogpost));
      }
    


      deletePost(id: number): Observable<DeleteResult> {
        return from(this.blogPostRepository.delete(id));
      }
    

      getAllBlogPosts(): Observable<BlogPostEntity[]> {
        const queryResult = from(this.blogPostRepository.find({ relations: ['user'] }));
      
        return queryResult;
      }



      findImageNameByPostId(id: number): Observable<string> {
        const options: FindOneOptions<BlogPostEntity> = {
          where: { id },  
          select: ['imagePath'],  
         
        };
       
        return from(this.blogPostRepository.findOne(options)).pipe(
          map((blog: BlogPostEntity | undefined) => {
            if (blog) {
              console.log(blog.imagePath);
              return blog.imagePath;
            } else {
              throw new Error('İmage not found');  
            }
          }),
        );
      }

       getBlogPostByTitle(id: number): Promise<BlogPostEntity | undefined> {
        return this.blogPostRepository.findOne({
          where: { id },
          relations: ['user'],  
        });
      }




      searchBlogPostsByTitle(title: string): Observable<BlogPostEntity[]> {
        return from(
          this.blogPostRepository
            .createQueryBuilder('post')
            .leftJoinAndSelect('post.user', 'user')
            .where('LOWER(post.title) LIKE :title', { title: `%${title.toLowerCase()}%` }) 
            .getMany()
        );
      }
      

      getBlogPostById(id: number): Observable<BlogPostEntity> {
        return from(this.blogPostRepository.findOne({ where: { id } })).pipe(
          catchError(() => {
          
            throw new NotFoundException('Blog post not found.');
          }),
        );
      }

       getBlogPostsByUserId(userId: number): Observable<BlogPostEntity[]> {
        return from(
          this.blogPostRepository
           .createQueryBuilder('blogPost')
           .leftJoinAndSelect('blogPost.user', 'user')
           .where('user.id = :userId', { userId })
          .getMany()
      );
    }




    async getLikedBlogPosts(ids: number[]): Promise<BlogPostEntity[]> {
    
      const blogPosts = await this.blogPostRepository.findByIds(ids);
      return blogPosts;
    }
















}

 