import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, USER_MODEL_NAME, UserDocument } from './user.schema';

type UserMaybeId = Omit<User, '_id'> & Partial<Pick<User, '_id'>>;
type UserWithId = Partial<User> & Pick<User, '_id'>;

@Injectable()
export class UserService {
  constructor(@InjectModel(USER_MODEL_NAME) private readonly model: Model<UserDocument>) {}

  async create(user: UserMaybeId): Promise<UserDocument> {
    user._id ??= new Types.ObjectId();
    const createdUser = new this.model(user);
    return createdUser.save();
  }

  async delete({ _id }: UserWithId): Promise<UserDocument | null> {
    return this.model.findByIdAndRemove({ _id }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.model.find().exec();
  }

  async findOne(id: Types.ObjectId): Promise<UserDocument | null> {
    return this.model.findById({ _id: id }).exec();
  }

  async update(user: UserWithId): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate({ _id: user._id }, user).exec();
  }
}
