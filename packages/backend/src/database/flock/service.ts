import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Flock, FlockDocument, FlockModel } from '.';

type FlockMaybeId = Omit<FlockModel, '_id'> & Partial<Pick<FlockModel, '_id'>>;
type FlockWithId = Partial<FlockModel> & Pick<FlockModel, '_id'>;

@Injectable()
export class FlockService {
  constructor(@InjectModel(Flock.name) private readonly model: Model<FlockDocument>) {}

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
