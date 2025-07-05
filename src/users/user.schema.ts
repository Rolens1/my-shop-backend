import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
    @Prop({required:true, unique:true})
    email:string;

    @Prop({required:true})
    password:string
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'userId',
});