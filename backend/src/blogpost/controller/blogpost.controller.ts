import { Controller, Param, Put,Get, NotFoundException, UploadedFile,UseInterceptors, Res, } from "@nestjs/common";
import { BlogPostService } from "../services/blogpost.service";
import { CommentService } from "src/comments/services/comment.service";
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Observable, of, switchMap } from 'rxjs';
import {
    Body,
    Post,
    Delete,
    Request,
    UseGuards,
  } from '@nestjs/common';
import { BlogPost, Technology } from "../models/blogpost.interface";
import { DeleteResult, UpdateResult } from "typeorm";
import { BlogPostEntity } from "../models/blogpost.entity";
import { CommentEntity } from "src/comments/models/comment.entity";
import { isFileExtensionSafe, removeFile, saveImageToStorage } from "src/auth/helpers/image-storage";
import { join } from "path";
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('blog')
export class BlogPostController {

    constructor(private blogpostservice: BlogPostService,private commentService: CommentService) {}



    @UseGuards(JwtGuard)
    @Post('image')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(@UploadedFile() file: Express.Multer.File): Observable<{ modifiedFileName: string } | { error: string }> {
      const fileName = file?.filename;
    
      if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });
    
      const imagesFolderPath = join(process.cwd(), 'images');
      const fullImagePath = join(imagesFolderPath, fileName);
    
      return isFileExtensionSafe(fullImagePath).pipe(
        switchMap((isFileLegit: boolean) => {
          if (isFileLegit) {
            return of({
              modifiedFileName: file.filename,
            });
          }
          removeFile(fullImagePath);
          return of({ error: 'File content does not match extension!' });
        }),
      );
    }
    


    @Get()
    getAllBlogPosts(): Observable<BlogPostEntity[]> {
      
      return this.blogpostservice.getAllBlogPosts();
    }
    @Get('/search/:term')
    getAllBlogPost(@Param('term') searchTerm?: string): Observable<BlogPostEntity[]> {
      console.log('Search Term:', searchTerm);
      return this.blogpostservice.searchBlogPostsByTitle(searchTerm);
    }
    




    @UseGuards(JwtGuard)
    @Post()
    create(@Body() blogPost: BlogPost, @Request() req): Observable<BlogPost> {
      console.log()
      blogPost.technology = blogPost.technology.toLowerCase() as Technology;
      return this.blogpostservice.createPost(req.user, blogPost);
    }


    @UseGuards(JwtGuard)
    @Delete(':id')
    delete(@Param('id') id: number): Observable<DeleteResult> {
      return this.blogpostservice.deletePost(id);
    }

    @UseGuards(JwtGuard)
    @Put(':id')
    update(
      @Param('id') id: number,
      @Body() blogPost: BlogPost,
    ): Observable<UpdateResult> {
      return this.blogpostservice.updatePost(id, blogPost);
    }
  
    @UseGuards(JwtGuard)
    @Post(':id/comment')
    createComment(
        @Param('id') blogPostId: number,
        @Body() comment: CommentEntity,
        @Request() req,
    ): Observable<CommentEntity> {
        
        return this.blogpostservice.getBlogPostById(blogPostId).pipe(
            switchMap((blogPost: BlogPostEntity) => {
                if (!blogPost) {
                    throw new NotFoundException('Blog post not found.');
                }
                comment.blogPost = blogPost;
                 
                comment.user = req.user;
                 
                return this.commentService.createComment(comment);
            }),
        );
    }

    @Get('posts/:userId')
     getBlogPostsByUserId(@Param('userId') userId: number) {
      return  this.blogpostservice.getBlogPostsByUserId(userId);
    }


    @Get('images/:id')
    findİmage(@Param('id') id: number, @Res() res): Observable<object> {
      return this.blogpostservice.findImageNameByPostId(id).pipe(
        switchMap((imageName: string) => {
          
          return of(res.sendFile(imageName, { root: './images' }));
        }),
      );
    }



  @Get('detail/:id')
  getBlogPostByTitle(@Param('id') id: number) {
    console.log(5)
    return this.blogpostservice.getBlogPostByTitle(id);
  }



  @Post('liked')
  async getLikedBlogPosts(@Body() data: { ids: number[] }): Promise<BlogPostEntity[]> {
    const { ids } = data;
    console.log(data)
    return this.blogpostservice.getLikedBlogPosts(ids);
  }





}
