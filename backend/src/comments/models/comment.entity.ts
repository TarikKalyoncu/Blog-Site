// comment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/auth/models/user.entity';
import { BlogPostEntity } from 'src/blogpost/models/blogpost.entity';


@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  detail: string;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  user: UserEntity;

  @ManyToOne(() => BlogPostEntity, (blogPost) => blogPost.comments)
  blogPost: BlogPostEntity;
}