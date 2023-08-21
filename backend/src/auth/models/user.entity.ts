import { BlogPostEntity } from 'src/blogpost/models/blogpost.entity';
import { CommentEntity } from 'src/comments/models/comment.entity';
import { UserDetailEntity } from 'src/userdetail/models/userdetail.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  imagePath: string;
  
  @OneToMany(() => UserDetailEntity, (userDetails) => userDetails.user)
  userDetails: UserDetailEntity[];

  @OneToMany(() => BlogPostEntity, (blogPost) => blogPost.user)
  blogPosts: BlogPostEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
