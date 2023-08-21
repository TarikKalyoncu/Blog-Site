import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './controllers/comment.controller';
import { AuthModule } from 'src/auth/auth.module';
import { CommentEntity } from './models/comment.entity';
import { CommentService } from './services/comment.service';
import { BlogPostEntity } from 'src/blogpost/models/blogpost.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CommentEntity,BlogPostEntity])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentsModule {}
