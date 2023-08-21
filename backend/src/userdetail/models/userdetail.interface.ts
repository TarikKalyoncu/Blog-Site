 
import { User } from '../../auth/models/user.interface';

export interface UserDetail {
  id?: number;
  occupation?: string;
  aboutMe?: string;
  instagramLink?: string;
  linkedinLink?: string;
  twitterLink?: string;
  youtubeLink?: string;
  user?: User;
  likedBlogPosts:number[];
}
