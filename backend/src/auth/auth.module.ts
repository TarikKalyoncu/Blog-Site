import { Module } from '@nestjs/common';
import { UserEntity } from './models/user.entity';
import { AuthService } from './services/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { JwtGuard } from './guards/jwt.guard';
import { JwtStrategy } from './guards/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MailerModule } from '@nestjs-modules/mailer';




@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '360000s' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', 
        port: 587,  
        secure: false,
        auth: {
          user: 'tarik.kalyoncu@ogr.sakarya.edu.tr',
          pass: 'ibuypowerfuria'
        },
      },
    }),
  ],
  providers: [AuthService, JwtGuard, JwtStrategy, RolesGuard, UserService],
  controllers: [AuthController, UserController],
  exports: [AuthService, UserService],
})
export class AuthModule {}
