import { User } from '../../auth/models/user.interface';
import { BlogPost } from '../../blogpost/models/blogpost.interface';

export interface Comments {
  id?: number;
  subject?: string;
  detail?: string;
  user?: User;
  blogPost?: BlogPost;
}