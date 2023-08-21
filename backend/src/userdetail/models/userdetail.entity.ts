 
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne  } from 'typeorm';
import { UserEntity } from 'src/auth/models/user.entity';
 
@Entity()
export class UserDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  occupation: string;

  @Column()
  aboutMe: string;

  @Column()
  instagramLink: string;

  @Column()
  linkedinLink: string;

  @Column()
  twitterLink: string;

  @Column()
  youtubeLink: string;

  @Column('integer', { array: true, default: [] })  
  likedBlogPosts: number[];  


  @ManyToOne(() => UserEntity, (user) => user.userDetails)
  user: UserEntity;
}