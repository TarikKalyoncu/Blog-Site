import { Body, Controller, Post, UseGuards,Request, Get, Param} from "@nestjs/common";
import { Observable, switchMap } from "rxjs";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { UserDetailService } from "../services/userdetail.service";
import { UserDetailEntity } from "../models/userdetail.entity";

@Controller('user')
export class UserDetailController {
    constructor(private userDetailService: UserDetailService) {}
    @UseGuards(JwtGuard)
    @Post('profile')
    createOrUpdateUserDetail(
        @Body() detail: UserDetailEntity,
        @Request() req,
    ): Observable<UserDetailEntity> {
         
        return this.userDetailService.findUserDetailByUserId(req.user.id).pipe(
            switchMap((userDetail: UserDetailEntity) => {
                if (userDetail) {
                  
                    userDetail.occupation = detail.occupation;
                    userDetail.aboutMe = detail.aboutMe;
                    userDetail.instagramLink = detail.instagramLink;
                    userDetail.linkedinLink = detail.linkedinLink;
                    userDetail.twitterLink = detail.twitterLink;
                    userDetail.youtubeLink = detail.youtubeLink;
                    console.log(userDetail)
                    return this.userDetailService.updateUserDetail(userDetail);
                } else {
                     
                    detail.user = req.user;
                    console.log(detail.user )
                    return this.userDetailService.createDetail(detail);
                }
            }),
        );
    }


    @Get('detail/:id')
    getUserDetail(@Param('id') id: number) {

      return this.userDetailService.findUserDetailByUserId(id);
    }


    @UseGuards(JwtGuard)
    @Post('bookmark')
    saveLikedBlogPost(@Body() data: { blogPostId: number }, @Request() req) {
        const userId = req.user.id;
        const blogPostId = data.blogPostId;
    
       
        return this.userDetailService.saveLikedBlogPost(userId, blogPostId);
    }
    
    @UseGuards(JwtGuard)
    @Post('unbookmark')
    unsaveLikedBlogPost(@Body() data: { blogPostId: number }, @Request() req) {
        const userId = req.user.id;
        const blogPostId = data.blogPostId;
    
         
        return this.userDetailService.unsaveLikedBlogPost(userId, blogPostId);
    }
    

    @UseGuards(JwtGuard)
    @Get('check-bookmark/:blogPostId')
    async checkIfBlogPostIsBookmarked(@Param('blogPostId') blogPostId: number, @Request() req) {
      const userId = req.user.id;
    
      const response = await this.userDetailService.checkIfBlogPostIsBookmarked(userId, blogPostId);
      return response;
    }
    


}


