import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, type Types } from 'mongoose';
import { USER_MODEL_NAME, type User, type UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_MODEL_NAME) private readonly model: Model<UserDocument>) {}

  async create(user: User): Promise<UserDocument> {
    return this.model.create(user);
  }

  async delete(_id: Types.ObjectId): Promise<UserDocument | null> {
    return this.model.findByIdAndRemove({ _id }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.model.find().exec();
  }

  async findOne(_id: Types.ObjectId): Promise<UserDocument | null> {
    return this.model.findById({ _id }).exec();
  }

  async update(_id: Types.ObjectId, user: Partial<User>): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate({ _id }, user).exec();
  }
}
