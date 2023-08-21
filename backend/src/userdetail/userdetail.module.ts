import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailService } from './services/userdetail.service';
import { UserDetailController } from './controllers/userdetail.controller';
import { UserDetailEntity } from './models/userdetail.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BlogPostEntity } from 'src/blogpost/models/blogpost.entity';
import { UserEntity } from 'src/auth/models/user.entity';

@Module({
  imports: [AuthModule,TypeOrmModule.forFeature([UserDetailEntity,BlogPostEntity,UserEntity])],
  providers: [UserDetailService],
  controllers: [UserDetailController],
})
export class UserdetailModule {}
