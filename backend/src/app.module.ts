import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { UserdetailModule } from './userdetail/userdetail.module';
import { BlogpostModule } from './blogpost/blogpost.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'Blog',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    CommentsModule,
    UserdetailModule,
    BlogpostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
