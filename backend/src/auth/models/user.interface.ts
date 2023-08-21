import { BlogPostEntity } from "src/blogpost/models/blogpost.entity";

import { CommentEntity } from "src/comments/models/comment.entity";

import { UserDetailEntity } from "src/userdetail/models/userdetail.entity";




export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imagePath?: string;
  userDetails: UserDetailEntity[];  
  blogPosts: BlogPostEntity[];  
  comments: CommentEntity[];  
}