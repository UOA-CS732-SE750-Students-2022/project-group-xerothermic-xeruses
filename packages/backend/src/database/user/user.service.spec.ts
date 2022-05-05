/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { closeMongoDBConnection, rootMongooseTestModule } from '../util/mongo.helper';
import { UserDatabaseModule } from './user.module';
import { UserDocument, UserSchema, USER_MODEL_NAME } from './user.schema';
import { UserService } from './user.service';
import { UserAvailabilityDocument } from './userAvailability.schema';
import { UserAvailabilityICal } from './userAvailabilityICal.schema';
import { UserAvailabilityProjectionDocument } from './util/projections.types';
import { UserDatabaseUtilModule } from './util/userDatabaseUtil.module';

const id = (id: string) => {
  if (id.length > 12) throw new Error('ObjectID length must not exceed 12 characters.');
  return new Types.ObjectId(id.padEnd(12, '_'));
};

const userDocument: Partial<UserDocument> = {
  _id: id('Test User'),
  name: 'Test User',
  firebaseId: 'QwerTY12345Qwerty12345qWErTY',
  flocks: [],
  flockInvites: [],
  availability: [
    { _id: id('Availabil_01'), type: 'ical', uri: 'uri://test' },
    { _id: id('Availabil_02'), type: 'ical', uri: 'uri://test2' },
  ] as UserAvailabilityDocument[],
};

describe(UserService.name, () => {
  let service: UserService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: USER_MODEL_NAME, schema: UserSchema }]),
        UserDatabaseUtilModule,
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(async () => {
    // This is where we setup our fake data.
    const userModel = module.get<Model<UserDocument>>(getModelToken(USER_MODEL_NAME));
    await userModel.deleteMany();
    await userModel.create(userDocument);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an user successfully', async () => {
    const createUserInput = {
      name: 'Test User',
      firebaseId: 'QwerTY12345Qwerty12345qWErTY',
    };

    const user: UserDocument = await service.create(createUserInput);
    expect(user._id).toBeInstanceOf(Types.ObjectId);
    expect(user.name).toEqual(createUserInput.name);
    expect(user.firebaseId).toEqual(createUserInput.firebaseId);
  });

  it('should return all users', async () => {
    const users: UserDocument[] | null = await service.findAll();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    checkEquality(users[0], userDocument);
  });

  it('should find one by id', async () => {
    const user: UserDocument | null = await service.findOne(userDocument._id!);
    checkEquality(user, userDocument);
  });

  it('should find one by firebaseId', async () => {
    const user: UserDocument | null = await service.findOneByFirebaseId(userDocument.firebaseId!);
    checkEquality(user, userDocument);
  });

  it('should update a user successfully', async () => {
    const user: UserDocument | null = await service.update(userDocument._id!, {
      name: 'New Name',
    });

    const updatedUserDocument = { ...userDocument, name: 'New Name' };
    checkEquality(user, updatedUserDocument);
  });

  it('should find add a flock to a user successfully', async () => {
    const flockId = new Types.ObjectId();
    const user: UserDocument | null = await service.addFlockToUser(userDocument._id!, flockId);

    const updatedUserDocument = { ...userDocument, flocks: [...(userDocument.flocks ?? []), flockId] };
    checkEquality(user, updatedUserDocument);
  });

  it('should find a user availability source', async () => {
    const user: UserDocument | null = await service.findUserAvailability(
      userDocument._id!,
      userDocument.availability![0]._id,
    );

    checkEquality(user, {
      _id: userDocument._id,
      availability: [userDocument.availability![0]],
    });
  });

  it('should find all user availability sources', async () => {
    const availabilityIds = userDocument.availability!.map((availability) => availability._id);

    const userAvailabilities: UserAvailabilityProjectionDocument[] = await service.findManyUserAvailability(
      availabilityIds,
    );

    expect(userAvailabilities.length).toBe(userDocument.availability?.length);

    userAvailabilities.forEach((userAvailability, index) => {
      expect(userAvailability).toEqual({
        _id: userDocument._id,
        userId: userDocument._id,
        availabilityDocument: userDocument.availability![index],
      });
    });
  });

  it('should add a new user availability source', async () => {
    const user: UserDocument | null = await service.addUserAvailability(userDocument._id!, [
      { type: 'ical', uri: 'uri://another' },
    ]);

    expect(user.availability.length).toEqual(userDocument.availability!.length + 1);

    const newAvailability = user.availability.at(-1) as UserAvailabilityICal;
    expect(newAvailability.type).toEqual('ical');
    expect(newAvailability.uri).toEqual('uri://another');
  });

  it('should not add a duplicate user availability source', async () => {
    const user: UserDocument | null = await service.addUserAvailability(userDocument._id!, [
      { type: 'ical', uri: 'uri://test' },
    ]);

    expect(user.availability.length).toEqual(userDocument.availability!.length);
  });

  it('should delete a user successfully', async () => {
    const user: UserDocument | null = await service.delete(userDocument._id!);
    checkEquality(user, userDocument);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeMongoDBConnection();
    }
  });

  const checkEquality = (user: UserDocument | null | undefined, expected: Partial<UserDocument> | null | undefined) => {
    if (user == null) {
      // If `user` is nullish then `expected` should match it.
      expect(user).toEqual(expected);
      return;
    }

    const userObj = user.toJSON();
    delete userObj['__v']; // don't check version
    expect(userObj).toEqual(expected);
  };
});
