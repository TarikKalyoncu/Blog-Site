import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BlogPostEntity } from './models/blogpost.entity';
import { BlogPostService } from './services/blogpost.service';
import { BlogPostController } from './controller/blogpost.controller';
import { CommentService } from 'src/comments/services/comment.service';
import { CommentEntity } from 'src/comments/models/comment.entity';
 
@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([BlogPostEntity,CommentEntity])],
    providers: [BlogPostService,CommentService],
    controllers: [BlogPostController],
  })
export class BlogpostModule {}
