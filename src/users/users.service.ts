import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {Model} from 'mongoose'
import { User } from './user.schema';
import { CreateUserRequest } from './dto/create-user.request';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}


    async createUser(data: CreateUserRequest): Promise<{id: string,email : string}> {
        try {
           const createdUser = new this.userModel({
            ...data,
            password: await bcrypt.hash(data.password, 10),
        })
        
        await createdUser.save() 
        return {id: createdUser.id, email: createdUser.email}
        } catch (error) {
            if (error.code === 11000) {
                throw new UnprocessableEntityException("Email already exists.")
            }
            console.error(error)
            throw(error)
        }
        
    }
}
