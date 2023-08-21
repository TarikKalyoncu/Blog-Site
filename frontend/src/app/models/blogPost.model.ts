import { User } from "../models/user.model";

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
    id: number;
    title?: string;
    imagePath: string;
    content: string;
    technology: Technology;
    status: Status;
    user?: User;
    comments?: Comment[];
    createdAt?: Date; 
  }
  