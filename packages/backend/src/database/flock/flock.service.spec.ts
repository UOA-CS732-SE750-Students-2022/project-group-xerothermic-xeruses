/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Model, type Query, Types } from 'mongoose';
import { type Flock, type FlockDocument, FLOCK_MODEL_NAME } from './flock.schema';
import { FlockService } from './flock.service';

const mockFlockDays = [
  {
    start: new Date(Date.UTC(2022, 9, 2, 10)).toISOString(),
    end: new Date(Date.UTC(2022, 9, 2, 16)).toISOString(),
  },
];

const id = (id: string) => {
  if (id.length > 12) throw new Error('ObjectID length must not exceed 12 characters.');
  return new Types.ObjectId(id.padEnd(12, '_'));
};

const mockFlock = (mock?: Partial<Flock>): Flock => ({
  name: mock?.name || '<flock name Alpha>',
  flockDays: mock?.flockDays || mockFlockDays,
  flockCode: mock?.flockCode || '<flock flockCode Alpha>',
  users: mock?.users || [],
});

const mockFlockDocument = (mock?: Partial<FlockDocument>): Partial<FlockDocument> => ({
  _id: mock?._id || id('FID_Alpha'),
  name: mock?.name || '<flock name Alpha>',
  flockDays: mock?.flockDays || mockFlockDays,
  flockCode: mock?.flockCode || '<flock flockCode Alpha>',
  users: mock?.users || [],
});

const FLOCK_DOCUMENTS = [
  mockFlockDocument(),
  mockFlockDocument({ _id: id('FID_Bravo'), name: '<flock name Bravo>', users: [] }),
  mockFlockDocument({ _id: id('FID_Charlie'), name: '<flock name Charlie>', users: [] }),
];

const FLOCKS = FLOCK_DOCUMENTS.map(mockFlock);

describe(FlockService.name, () => {
  let service: FlockService;
  let model: Model<FlockDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlockService,
        {
          provide: getModelToken(FLOCK_MODEL_NAME),
          useValue: class {
            static create = jest.fn();
            static find = jest.fn();
            static findById = jest.fn();
            static findByIdAndRemove = jest.fn();
            static findByIdAndUpdate = jest.fn();
            static exec = jest.fn();
          },
        },
      ],
    }).compile();

    service = module.get(FlockService);
    model = module.get(getModelToken(FLOCK_MODEL_NAME));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //

  it('should insert a new flock', async () => {
    jest.spyOn(model, 'create').mockReturnValueOnce(FLOCK_DOCUMENTS[0] as any);
    const newFlock = await service.create(FLOCKS[0]);
    expect(newFlock).toEqual(FLOCK_DOCUMENTS[0]);
  });

  it('should delete a flock successfully', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValueOnce(
      createMock<Query<FlockDocument, FlockDocument>>({
        exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS[0]),
      }) as any,
    );
    expect(await service.delete(FLOCK_DOCUMENTS[0]._id!)).toEqual(FLOCK_DOCUMENTS[0]);
  });

  it('should return all flocks', async () => {
    jest.spyOn(model, 'find').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS),
    } as any);
    const flocks = await service.findAll();
    expect(flocks).toEqual(FLOCK_DOCUMENTS);
  });

  it('should find one by id', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce(
      createMock<Query<FlockDocument, FlockDocument>>({
        exec: jest.fn().mockResolvedValueOnce(mockFlockDocument(FLOCK_DOCUMENTS[0])),
      }) as any,
    );
    const foundFlock = await service.findOne(FLOCK_DOCUMENTS[0]._id!);
    expect(foundFlock).toEqual(FLOCK_DOCUMENTS[0]);
  });

  it('should update a flock successfully', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
      createMock<Query<FlockDocument, FlockDocument>>({
        exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS[0]),
      }) as any,
    );
    const updatedFlock = await service.update(FLOCK_DOCUMENTS[0]._id!, FLOCKS[0]);
    expect(updatedFlock).toEqual(FLOCK_DOCUMENTS[0]);
  });
});
