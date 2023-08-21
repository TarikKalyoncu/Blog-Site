
import { User } from '../../auth/models/user.interface';
import { CommentEntity } from 'src/comments/models/comment.entity';


export enum Technology {
  HTML = 'htlm',
  CSS = 'css',
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  Angular = 'angular',
  React = 'react',
  Vue = 'vue',
  NodeJS = 'nodejs',
  Genel = 'Genel',
  MongoDB = 'mongodb',
  Git= 'git',
  jQuery = 'jquery',
  PHP= 'php',
  SQL= 'sql',
 
}

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
  
}

export interface BlogPost {
  blogpost: User;
  id?: number;
  imagePath?: string;
  title?: string;
  content?: string;
  technology?: Technology;
  status?: Status;
  user?: User;
  comments?: CommentEntity[];  
  createdAt: Date; 
}