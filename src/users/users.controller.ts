import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { UsersService } from './users.service';
import { NoFilesInterceptor } from '@nestjs/platform-express'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TokenPayload } from '../auth/token-payload.interface';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseInterceptors(NoFilesInterceptor())
    @Post()
    createUser(@Body() request: CreateUserRequest) {
        return this.usersService.createUser(request)
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(
        @CurrentUser() user: TokenPayload 
    ){
        return user        
    }
}


