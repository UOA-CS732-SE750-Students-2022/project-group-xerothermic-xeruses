import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, Types } from 'mongoose';
import { FLOCK_MODEL_NAME, type Flock, type FlockDocument } from './flock.schema';

type FlockMaybeId = Omit<Flock, '_id'> & Partial<Pick<Flock, '_id'>>;
type FlockWithId = Partial<Flock> & Pick<Flock, '_id'>;

@Injectable()
export class FlockService {
  constructor(@InjectModel(FLOCK_MODEL_NAME) private readonly model: Model<FlockDocument>) {}

  async create(flock: FlockMaybeId): Promise<FlockDocument> {
    flock._id ??= new Types.ObjectId();
    const createdFlock = new this.model(flock);
    return createdFlock.save();
  }

  async delete({ _id }: FlockWithId): Promise<FlockDocument | null> {
    return this.model.findByIdAndRemove({ _id }).exec();
  }

  async findAll(): Promise<FlockDocument[]> {
    return this.model.find().exec();
  }

  async findOne(_id: Types.ObjectId): Promise<FlockDocument | null> {
    return this.model.findById({ _id }).exec();
  }

  async update(flock: FlockWithId): Promise<FlockDocument | null> {
    return this.model.findByIdAndUpdate({ _id: flock._id }, flock).exec();
  }
}