import { Injectable, UnauthorizedException } from '@nestjs/common';
import ms, { StringValue } from 'ms'
import * as bcrypt from 'bcrypt'
import { User } from '../users/user.schema';
import { UsersService } from '../users/users.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService, 
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService) {}

    async login(user: User, response: Response) {
        const expires = new Date()

        const jwtExpiration = this.configService.getOrThrow<string>("JWT_EXPIRATION") as unknown
        const expiresInMs = ms(jwtExpiration as ms.StringValue)
        if (typeof expiresInMs !== 'number') {
            throw new Error('Invalid JWT_EXPIRATION format')
        }
        expires.setMilliseconds(expires.getMilliseconds() + expiresInMs)

        const tokenPayload: TokenPayload = {
            userId: user.id,
        }

        const token = this.jwtService.sign(tokenPayload)
        response.cookie("Authentication", token, {
            secure: true,
            httpOnly: true,
            expires
        })

        return { tokenPayload }
    }

    async verifyUser(email:string, password: string) {
        try {
            const user = await this.usersService.getUser({email})
            if (!user) {
                throw new UnauthorizedException();
            }
            const authenticated = await bcrypt.compare(password, user.password)
            if(!authenticated) throw new UnauthorizedException()
            return user
        } catch (error) {
            throw new UnauthorizedException("Credentials are not valid")
        }
    }
}
