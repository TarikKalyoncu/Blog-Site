// blog-post.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from 'src/auth/models/user.entity';
import { Status, Technology } from './blogpost.interface';
import { CommentEntity } from 'src/comments/models/comment.entity';
 

@Entity()
export class BlogPostEntity {
  @PrimaryGeneratedColumn()
  id: number;


  @Column()
  title: string;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: 'text' }) 
  content: string;

  @Column({ type: 'enum', enum: Technology })
  technology: Technology;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @ManyToOne(() => UserEntity, (user) => user.blogPosts)
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.blogPost)
  comments: CommentEntity[];

  @CreateDateColumn()  
  createdAt: Date;
}
