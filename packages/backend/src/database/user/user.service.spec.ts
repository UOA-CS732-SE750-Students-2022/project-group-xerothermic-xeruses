/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { closeMongoDBConnection, rootMongooseTestModule } from '../util/mongo.helper';
import { UserDocument, UserSchema, USER_MODEL_NAME } from './user.schema';
import { UserService } from './user.service';
import { UserDatabaseUtilModule } from './util/userDatabaseUtil.module';

const userDocument: Partial<UserDocument> = {
  _id: new Types.ObjectId(),
  name: 'Test User',
  firebaseId: 'QwerTY12345Qwerty12345qWErTY',
  flocks: [],
  flockInvites: [],
  availability: [],
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

    service = service = module.get<UserService>(UserService);
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
    userDocument._id = user._id;

    expect(user).toBeTruthy();
    checkEquality(user!, userDocument);
  });

  it('should return all users', async () => {
    const users: UserDocument[] | null = await service.findAll();

    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBe(1);
    checkEquality(users[0], userDocument);
  });

  it('should find one by id', async () => {
    const user: UserDocument | null = await service.findOne(userDocument._id!);

    expect(user).toBeTruthy();
    checkEquality(user!, userDocument);
  });

  it('should find one by firebaseId', async () => {
    const user: UserDocument | null = await service.findOneByFirebaseId(userDocument.firebaseId!);

    expect(user).toBeTruthy();
    checkEquality(user!, userDocument);
  });

  it('should update a user successfully', async () => {
    const user: UserDocument | null = await service.update(userDocument._id!, {
      name: 'New Name',
    });

    const updatedUserDocument: Partial<UserDocument> = userDocument;
    updatedUserDocument.name = 'New Name';

    expect(user).toBeTruthy();
    checkEquality(user!, updatedUserDocument);
  });

  it('should delete a user successfully', async () => {
    const user: UserDocument | null = await service.delete(userDocument._id!);

    expect(user).toBeTruthy();
    checkEquality(user!, userDocument);
  });

  afterAll(async () => {
    if (module) {
      await module.close();
      await closeMongoDBConnection();
    }
  });
});

const checkEquality = (user: UserDocument, expected: Partial<UserDocument>) => {
  expect(user._id).toEqual(expected._id);
  expect(user.name).toEqual(expected.name);
  expect(user.firebaseId).toEqual(expected.firebaseId);
  expect(user.flocks).toEqual(expected.flocks);
  expect(user.flockInvites).toEqual(expected.flockInvites);
  expect(user.availability).toEqual(expected.availability);
};
