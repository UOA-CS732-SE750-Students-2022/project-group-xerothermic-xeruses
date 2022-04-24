import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model, type Types } from 'mongoose';
import { FlockUtil } from '~/util/flock.util';
import { FLOCK_MODEL_NAME, type Flock, type FlockDocument } from './flock.schema';

const FLOCK_CODE_LENGTH = 8;

/**
 * Service for managing Flocks in the database.
 * A Flock represents a multi-user ('flock') availability schedule.
 */
@Injectable()
export class FlockService {
  constructor(
    @InjectModel(FLOCK_MODEL_NAME) private readonly model: Model<FlockDocument>,
    @Inject(forwardRef(() => FlockUtil))
    private flockUtil: FlockUtil,
  ) {}

  async create(flock: Omit<Flock, 'users' | 'flockCode'>): Promise<FlockDocument> {
    const flockCode = await this.flockUtil.generateFlockCode(FLOCK_CODE_LENGTH);
    return this.model.create({ ...flock, flockCode, users: [] });
  }

  async delete(_id: Types.ObjectId | string): Promise<FlockDocument | null> {
    return this.model.findByIdAndRemove({ _id }).exec();
  }

  async findAll(): Promise<FlockDocument[]> {
    return this.model.find().exec();
  }

  async findMany(_ids: (Types.ObjectId | string)[]): Promise<FlockDocument[]> {
    return this.model
      .find({
        _id: { $in: _ids },
      })
      .exec();
  }

  async findOne(_id: Types.ObjectId | string): Promise<FlockDocument | null> {
    return this.model.findById({ _id }).exec();
  }

  async findOneByCode(flockCode: string): Promise<FlockDocument | null> {
    return this.model
      .findOne({
        flockCode,
      })
      .exec();
  }

  async update(_id: Types.ObjectId | string, flock: Partial<Flock>): Promise<FlockDocument | null> {
    return this.model.findByIdAndUpdate({ _id }, flock).exec();
  }
}
