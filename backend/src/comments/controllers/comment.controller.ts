import { Controller, Delete, Get, Param, UseGuards } from "@nestjs/common";
import { CommentService } from "../services/comment.service";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { CommentEntity } from "../models/comment.entity";
import { Observable } from "rxjs";

@Controller('comment')
export class CommentController {



    constructor(private commentService: CommentService) {}

  
    @Get(':blogPostId')
    getCommentsByBlogPostId(@Param('blogPostId') blogPostId: number): Observable<CommentEntity[]> {
      console.log(blogPostId)
      return this.commentService.getCommentsByBlogPostId(blogPostId);
    }
  
    @UseGuards(JwtGuard)
    @Delete(':commentId')
    deleteCommentById(@Param('commentId') commentId: number): Observable<CommentEntity> {
      return this.commentService.deleteCommentById(commentId);
    }


}
