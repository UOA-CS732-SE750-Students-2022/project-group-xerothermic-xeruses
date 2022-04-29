import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, type Types } from 'mongoose';
import { USER_MODEL_NAME, type User, type UserDocument } from './user.schema';
import { UserAvailability } from './userAvailability.schema';
import { UserAvailabilityUtil } from './util/userAvailability.util';

/**
 * Service for managing Users in the database.
 * A User represents a single unique person with their Flocks, availability & settings.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_NAME) private readonly model: Model<UserDocument>,
    private readonly userAvailabilityUtil: UserAvailabilityUtil,
  ) {}

  async create(user: Omit<User, 'flocks' | 'flockInvites' | 'availability' | 'settings'>): Promise<UserDocument> {
    return this.model.create({ ...user, flocks: [], flockInvites: [], availability: [], settings: {} });
  }

  async delete(_id: Types.ObjectId | string): Promise<UserDocument | null> {
    return this.model.findByIdAndRemove({ _id }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.model.find().exec();
  }

  async findMany(_ids: (Types.ObjectId | string)[]): Promise<UserDocument[]> {
    return this.model
      .find({
        _id: { $in: _ids },
      })
      .exec();
  }

  async findOne(_id: Types.ObjectId | string): Promise<UserDocument | null> {
    return this.model.findById({ _id }).exec();
  }

  async findOneByFirebaseId(firebaseId: string): Promise<UserDocument | null> {
    return this.model.findOne({ firebaseId }).exec();
  }

  async update(_id: Types.ObjectId | string, user: Partial<User>): Promise<UserDocument | null> {
    return this.model.findByIdAndUpdate({ _id }, user).exec();
  }

  async findUserAvailability(
    userId: Types.ObjectId | string,
    availabilityId: Types.ObjectId | string,
  ): Promise<UserDocument | null> {
    return this.model.findOne({ _id: userId, 'availability._id': availabilityId }, { 'availability.$': 1 }).exec();
  }

  async addFlockToUser(_id: Types.ObjectId | string, flockId: Types.ObjectId | string): Promise<UserDocument | null> {
    return this.model
      .findByIdAndUpdate(
        { _id },
        {
          $push: {
            flocks: flockId,
          },
        },
        { new: true },
      )
      .exec();
  }

  async addUserAvailability(
    userId: Types.ObjectId | string,
    availabilitySources: UserAvailability[],
  ): Promise<UserDocument> {
    const user = await this.findOne(userId);
    if (!user) {
      throw new Error(`Failed finding user ${userId}.`);
    }

    // Not very performant, but works for now.
    // Always use toUserAvailability to ensure the keys are in a consistent order.
    const existingSources = new Set(
      user.availability.map((availabilitySource) =>
        JSON.stringify(this.userAvailabilityUtil.toUserAvailability(availabilitySource)),
      ),
    );

    for (const availabilitySource of availabilitySources) {
      const json = JSON.stringify(this.userAvailabilityUtil.toUserAvailability(availabilitySource));
      if (existingSources.has(json)) {
        // Ignore duplicate sources.
        continue;
      }

      existingSources.add(json);
      user.availability.push(availabilitySource);
    }

    await user.save();
    return user;
  }
}
