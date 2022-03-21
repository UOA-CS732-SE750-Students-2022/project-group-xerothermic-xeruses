import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, type Types } from 'mongoose';
import { FLOCK_MODEL_NAME, type Flock, type FlockDocument } from './flock.schema';

/**
 * Service for managing Flocks in the database.
 * A Flock represents a multi-user ('flock') availability schedule.
 */
@Injectable()
export class FlockService {
  constructor(@InjectModel(FLOCK_MODEL_NAME) private readonly model: Model<FlockDocument>) {}

  async create(flock: Flock): Promise<FlockDocument> {
    return this.model.create(flock);
  }

  async delete(_id: Types.ObjectId): Promise<FlockDocument | null> {
    return this.model.findByIdAndRemove({ _id }).exec();
  }

  async findAll(): Promise<FlockDocument[]> {
    return this.model.find().exec();
  }

  async findOne(_id: Types.ObjectId): Promise<FlockDocument | null> {
    return this.model.findById({ _id }).exec();
  }

  async update(_id: Types.ObjectId, flock: Partial<Flock>): Promise<FlockDocument | null> {
    return this.model.findByIdAndUpdate({ _id }, flock).exec();
  }
}
