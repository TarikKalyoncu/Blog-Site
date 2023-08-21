import { BlogPost } from "./blogPost.model";
import { User } from "./user.model";

export interface comment {
    id?: number;
    subject?: string;
    detail?: string;
    user: User;
    blogPost?: BlogPost;
  }
  