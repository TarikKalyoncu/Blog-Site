import {
    Controller,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    Request,
    Get,
    Res,
    Param,
    Body,
  } from '@nestjs/common';
  
  import { FileInterceptor } from '@nestjs/platform-express';
  import { join } from 'path';
  import { Observable, of } from 'rxjs';
  import { map, switchMap } from 'rxjs/operators';
   
  import { JwtGuard } from '../guards/jwt.guard';
  import {
    isFileExtensionSafe,
    saveImageToStorage,
    removeFile,
  } from '../helpers/image-storage';
  import { UserService } from '../services/user.service';
import { MailerService } from '@nestjs-modules/mailer';
  
 
  @Controller('blog')
  export class UserController {
    constructor(private userService: UserService,private readonly mailerService: MailerService) {}
  
    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(
      @UploadedFile() file: Express.Multer.File,
      @Request() req,
    ): Observable<{ modifiedFileName: string } | { error: string }> {
      const fileName = file?.filename;
  
      if (!fileName) return of({ error: 'File must be a png, jpg/jpeg' });
  
      const imagesFolderPath = join(process.cwd(), 'images');
      const fullImagePath = join(imagesFolderPath + '/' + file.filename);
  
      return isFileExtensionSafe(fullImagePath).pipe(
        switchMap((isFileLegit: boolean) => {
          if (isFileLegit) {
            const userId = req.user.id;
            return this.userService.updateUserImageById(userId, fileName).pipe(
              map(() => ({
                modifiedFileName: file.filename,
              })),
            );
          }
          removeFile(fullImagePath);
          return of({ error: 'File content does not match extension!' });
        }),
      );
    }
  
    @Get(':id')
    findUser(@Param('id') id: number, @Res() res): Observable<object> {
      return this.userService.findImageNameByUserId(id).pipe(
        switchMap((imageName: string) => {
          console.log(5,imageName)
          return of(res.sendFile(imageName, { root: './images' }));
        }),
      );
    }


    @Get('selamlar/:id')
  findUserr(@Param('id') id: number, @Res() res): Observable<object> {
    return this.userService.findImageNameByUserId(id).pipe(
      switchMap((imageName: string) => {
        if (imageName) {
          return of(res.sendFile(imageName, { root: './images' }));
        } else {
          return of(res.sendFile('profile.jpg', { root: './images' }));
        }
      }),
    );
  }


    @Get('profile/:id')
    async getUserProfile(@Param('id') id: number) {
      const userProfile = await this.userService.findUserById(id);
      return userProfile;
    }


    

    
    
   
    
      @Post('contact/send-email')
      async sendEmail(@Body() data: any): Promise<any> {
        try {
          const { name, toEmail, subject, message } = data;
    console.log(data)
          await this.mailerService.sendMail({
            to: 'tarik.kalyoncu@ogr.sakarya.edu.tr',
            from: `"Kullanıcı" <${toEmail}>`,
            subject,
            text: `"Kullanıcı:" <${toEmail}> "İsim:" <${name}>` + message,
          });
    
          return { message: 'Email sent successfully' };
        } catch (error) {
          console.error('Error while sending email:', error);
          throw new Error('An error occurred while sending the email');
        }
      }
    
    




    
  }