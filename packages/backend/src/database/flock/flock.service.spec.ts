/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { FlockUtil } from '~/util/flock.util';
import { closeMongoDBConnection, rootMongooseTestModule } from '../util/mongo.helper';
import { FlockDocument, FlockSchema, FLOCK_MODEL_NAME } from './flock.schema';
import { FlockService } from './flock.service';
import { UserFlockAvailabilityDocument } from './userFlockAvailability.schema';

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
    expect(flock!.userFlockAvailability).toEqual(flockDocument.userFlockAvailability);
  });

  it('should return all flocks', async () => {
    const flocks: FlockDocument[] | null = await service.findAll();

    expect(flocks).toBeDefined();
    expect(Array.isArray(flocks)).toBe(true);
    expect(flocks.length).toBe(1);
    checkEquality(flocks[0], flockDocument);
    expect(flocks[0]!.userFlockAvailability).toEqual(flockDocument.userFlockAvailability);
  });

  it('should find one by id', async () => {
    const flock: FlockDocument | null = await service.findOne(flockDocument._id!);

    expect(flock).toBeTruthy();
    checkEquality(flock!, flockDocument);
    expect(flock!.userFlockAvailability).toEqual(flockDocument.userFlockAvailability);
  });

  it('should find one by flockCode', async () => {
    const flock: FlockDocument | null = await service.findOneByCode(flockDocument.flockCode!);

    expect(flock).toBeTruthy();
    checkEquality(flock!, flockDocument);
    expect(flock!.userFlockAvailability).toEqual(flockDocument.userFlockAvailability);
  });

  it('should update a flock successfully', async () => {
    const flock: FlockDocument | null = await service.update(flockDocument._id!, {
      name: 'New Name',
    });

    const updatedFlockDocument: Partial<FlockDocument> = flockDocument;
    updatedFlockDocument.name = 'New Name';

    expect(flock).toBeTruthy();
    checkEquality(flock!, updatedFlockDocument);
    expect(flock!.userFlockAvailability).toEqual(flockDocument.userFlockAvailability);
  });

  it('should add a user to a flock successfully', async () => {
    const userId = new Types.ObjectId();
    flockDocument.users!.push(userId);
    const flock: FlockDocument | null = await service.addUserToFlock(flockDocument._id!, userId);

    expect(flock).toBeTruthy();
    checkEquality(flock!, flockDocument);
    expect(flock!.userFlockAvailability).toEqual(flockDocument.userFlockAvailability);
  });

  it('should add a user flock availability to a flock successfully', async () => {
    const userFlockAvailability = {
      user: new Types.ObjectId(),
      userAvailabilityId: new Types.ObjectId(),
      enabled: true,
    };
    flockDocument.userFlockAvailability!.push(userFlockAvailability as UserFlockAvailabilityDocument);
    const flock: FlockDocument | null = await service.addUserFlockAvailability(
      flockDocument._id!,
      userFlockAvailability as UserFlockAvailabilityDocument,
    );

    checkEquality(flock!, flockDocument);
    expect(flock!.userFlockAvailability[0].user).toEqual(flockDocument.userFlockAvailability![0].user);
    expect(flock!.userFlockAvailability[0].userAvailabilityId).toEqual(
      flockDocument.userFlockAvailability![0].userAvailabilityId,
    );
    expect(flock!.userFlockAvailability[0].enabled).toEqual(flockDocument.userFlockAvailability![0].enabled);
  });

  it('should delete a flock successfully', async () => {
    const flock: FlockDocument | null = await service.delete(flockDocument._id!);

    expect(flock).toBeTruthy();
    checkEquality(flock!, flockDocument);
    expect(flock!.userFlockAvailability[0].user).toEqual(flockDocument.userFlockAvailability![0].user);
    expect(flock!.userFlockAvailability[0].userAvailabilityId).toEqual(
      flockDocument.userFlockAvailability![0].userAvailabilityId,
    );
    expect(flock!.userFlockAvailability[0].enabled).toEqual(flockDocument.userFlockAvailability![0].enabled);
  });

  it('should not find one by id after document is deleted', async () => {
    const flock: FlockDocument | null = await service.findOne(flockDocument._id!);

    expect(flock).toBeNull();
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
};
