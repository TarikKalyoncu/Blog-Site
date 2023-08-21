import { Injectable  } from "@nestjs/common";
import { CommentEntity } from "../models/comment.entity";
import { Observable, from, map } from "rxjs";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";


@Injectable()
export class CommentService {

    
    constructor(

        @InjectRepository(CommentEntity)

        private readonly commentRepository: Repository<CommentEntity>,
      ) {}



    createComment(comment: CommentEntity): Observable<CommentEntity> {
      return from(this.commentRepository.save(comment));
    }

    getCommentsByBlogPostId(blogPostId: number): Observable<CommentEntity[]> {
      return from(this.commentRepository.find({
        where: { blogPost: { id: blogPostId } },
        relations: ['user'], 
      }));
    }

    relations: ['user']

    deleteCommentById(commentId: number): Observable<CommentEntity> {
     console.log(commentId)
      return from(this.commentRepository.delete(commentId)).pipe(map(() => undefined));
    }



      

}
