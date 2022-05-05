/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { FlockUtil } from '~/util/flock.util';
import { closeMongoDBConnection, rootMongooseTestModule } from '../util/mongo.helper';
import { FlockDocument, FlockSchema, FLOCK_MODEL_NAME } from './flock.schema';
import { FlockService } from './flock.service';
import { UserFlockAvailabilityDocument } from './userFlockAvailability.schema';

const id = (id: string) => {
  if (id.length > 12) throw new Error('ObjectID length must not exceed 12 characters.');
  return new Types.ObjectId(id.padEnd(12, '_'));
};

const flockDocument: Partial<FlockDocument> = {
  _id: id('Test Flock'),
  name: 'Test Flock',
  flockCode: 'QWERTY12',
  flockDays: [
    {
      start: new Date(Date.UTC(2022, 9, 2, 10)),
      end: new Date(Date.UTC(2022, 9, 2, 16)),
    },
  ],
  users: [id('Test User 1'), id('Test User 2')],
  userFlockAvailability: [
    { _id: id('Avail 1'), user: id('Test User 1'), userAvailabilityId: id('Availabil_01'), enabled: false },
  ] as UserFlockAvailabilityDocument[],
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

  beforeEach(async () => {
    // This is where we setup our fake data.
    const flockModel = module.get<Model<FlockDocument>>(getModelToken(FLOCK_MODEL_NAME));
    await flockModel.deleteMany();
    await flockModel.create(flockDocument);
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

    expect(flock._id).toBeInstanceOf(Types.ObjectId);
    expect(flock.name).toEqual(createFlockInput.name);
    expect(flock.flockDays).toEqual(createFlockInput.flockDays);
  });

  it('should return all flocks', async () => {
    const flocks: FlockDocument[] | null = await service.findAll();

    expect(Array.isArray(flocks)).toBe(true);
    expect(flocks.length).toBe(1);
    checkEquality(flocks[0], flockDocument);
  });

  it('should find one by id', async () => {
    const flock: FlockDocument | null = await service.findOne(flockDocument._id!);
    checkEquality(flock, flockDocument);
  });

  it('should find one by flockCode', async () => {
    const flock: FlockDocument | null = await service.findOneByCode(flockDocument.flockCode!);
    checkEquality(flock, flockDocument);
  });

  it('should update a flock successfully', async () => {
    const flock: FlockDocument | null = await service.update(flockDocument._id!, {
      name: 'New Name',
    });

    const updatedFlockDocument = { ...flockDocument, name: 'New Name' };
    checkEquality(flock, updatedFlockDocument);
  });

  it('should add a user to a flock successfully', async () => {
    const userId = id('New User');
    const flock: FlockDocument | null = await service.addUserToFlock(flockDocument._id!, userId);

    expect(flock!.users.length).toEqual(flockDocument.users!.length + 1);
    expect(flock!.users).toContainEqual(userId);
  });

  it('should add a user flock availability to a flock successfully', async () => {
    const userFlockAvailability = {
      user: id('Test User 2'),
      userAvailabilityId: id('Availabil_02'),
      enabled: true,
    };

    const flock: FlockDocument | null = await service.addUserFlockAvailability(
      flockDocument._id!,
      userFlockAvailability as UserFlockAvailabilityDocument,
    );

    expect(flock!.userFlockAvailability.length).toEqual(flockDocument.userFlockAvailability!.length + 1);

    const newAvailability = flock!.userFlockAvailability.at(-1);
    expect(newAvailability!.enabled).toBeTruthy();
    expect(newAvailability!.user).toEqual(userFlockAvailability.user);
    expect(newAvailability!.userAvailabilityId).toEqual(userFlockAvailability.userAvailabilityId);
  });

  it('should delete a flock successfully', async () => {
    const flock: FlockDocument | null = await service.delete(flockDocument._id!);

    checkEquality(flock, flockDocument);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeMongoDBConnection();
    }
  });

  const checkEquality = (
    flock: FlockDocument | null | undefined,
    expected: Partial<FlockDocument> | null | undefined,
  ) => {
    if (flock == null) {
      // If `flock` is nullish then `expected` should match it.
      expect(flock).toEqual(expected);
      return;
    }

    const flockObj = flock.toJSON();
    delete flockObj['__v']; // don't check version
    expect(flockObj).toEqual(expected);
  };
});
