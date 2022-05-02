/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { FlockUtil } from '~/util/flock.util';
import { closeMongoDBConnection, rootMongooseTestModule } from '../util/mongo.helper';
import { FlockDocument, FlockSchema, FLOCK_MODEL_NAME } from './flock.schema';
import { FlockService } from './flock.service';

const flockDocument: Partial<FlockDocument> = {
  _id: new Types.ObjectId(),
  name: 'Test Flock',
  flockCode: 'QWERTY12',
  flockDays: [
    {
      start: new Date(Date.UTC(2022, 9, 2, 10)),
      end: new Date(Date.UTC(2022, 9, 2, 16)),
    },
  ],
  users: [],
  userFlockAvailability: [],
};

describe(FlockService.name, () => {
  let service: FlockService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), MongooseModule.forFeature([{ name: FLOCK_MODEL_NAME, schema: FlockSchema }])],
      providers: [FlockService, FlockUtil],
    }).compile();

    service = service = module.get<FlockService>(FlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a flock successfully', async () => {
    const createFlockInput = {
      name: 'Test Flock',
      flockDays: [
        {
          start: new Date(Date.UTC(2022, 9, 2, 10)),
          end: new Date(Date.UTC(2022, 9, 2, 16)),
        },
      ],
    };

    const flock: FlockDocument = await service.create(createFlockInput);
    flockDocument._id = flock._id;
    flockDocument.flockCode = flock.flockCode;

    expect(flock).toBeTruthy();
    checkEquality(flock!, flockDocument);
  });

  it('should return all flocks', async () => {
    const flocks: FlockDocument[] | null = await service.findAll();

    expect(flocks).toBeDefined();
    expect(Array.isArray(flocks)).toBe(true);
    expect(flocks.length).toBe(1);
    checkEquality(flocks[0], flockDocument);
  });

  it('should find one by id', async () => {
    const user: FlockDocument | null = await service.findOne(flockDocument._id!);

    expect(user).toBeTruthy();
    checkEquality(user!, flockDocument);
  });

  it('should find one by flockCode', async () => {
    const user: FlockDocument | null = await service.findOneByCode(flockDocument.flockCode!);

    expect(user).toBeTruthy();
    checkEquality(user!, flockDocument);
  });

  it('should update a flock successfully', async () => {
    const user: FlockDocument | null = await service.update(flockDocument._id!, {
      name: 'New Name',
    });

    const updatedFlockDocument: Partial<FlockDocument> = flockDocument;
    updatedFlockDocument.name = 'New Name';

    expect(user).toBeTruthy();
    checkEquality(user!, updatedFlockDocument);
  });

  it('should delete a flock successfully', async () => {
    const user: FlockDocument | null = await service.delete(flockDocument._id!);

    expect(user).toBeTruthy();
    checkEquality(user!, flockDocument);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeMongoDBConnection();
    }
  });
});

const checkEquality = (flock: FlockDocument, expected: Partial<FlockDocument>) => {
  expect(flock._id).toEqual(expected._id);
  expect(flock.name).toEqual(expected.name);
  expect(flock.flockDays).toEqual(expected.flockDays);
  expect(flock.users).toEqual(expected.users);
  expect(flock.userFlockAvailability).toEqual(expected.userFlockAvailability);
};
