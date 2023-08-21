import { BlogPost } from "./blogPost.model";
import { comment } from "./comment.model";
import { UserDetail } from "./userDetail.model";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imagePath: string;
    userDetails?: UserDetail[];
    blogPosts?: BlogPost[];
    comments?: comment[];
  }