/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Model, type Query, Types } from 'mongoose';
import { type User, type UserDocument, USER_MODEL_NAME } from './user.schema';
import { UserService } from './user.service';
import { UserAvailabilityDocument } from './userAvailability.schema';
import { UserDatabaseUtilModule } from './util/userDatabaseUtil.module';

const id = (id: string) => {
  if (id.length > 12) throw new Error('ObjectID length must not exceed 12 characters.');
  return new Types.ObjectId(id.padEnd(12, '_'));
};

const mockUser = (mock?: Partial<User>): User => ({
  name: mock?.name || '<user name Alpha>',
  firebaseId: mock?.firebaseId || '<user firebaseId Alpha>',
  flocks: [],
  flockInvites: [],
  availability: [],
});

const mockUserDocument = (mock?: Partial<UserDocument>): Partial<UserDocument> => ({
  _id: mock?._id || id('UID_Alpha'),
  name: mock?.name || '<user name Alpha>',
  firebaseId: mock?.firebaseId || '<user firebaseId Alpha>',
  flocks: mock?.flocks || [],
  flockInvites: mock?.flockInvites || [],
  availability: mock?.availability || [],
  save: jest.fn(),
});

const USER_DOCUMENTS = [
  mockUserDocument(),
  mockUserDocument({ _id: id('UID_Bravo'), name: '<user uuid Bravo>', firebaseId: '<user firebaseId Bravo>' }),
  mockUserDocument({ _id: id('UID_Charlie'), name: '<user uuid Charlie>', firebaseId: '<user firebaseId Charlie>' }),
];

const USERS = USER_DOCUMENTS.map(mockUser);

describe(UserService.name, () => {
  let service: UserService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserDatabaseUtilModule],
      providers: [
        UserService,
        {
          provide: getModelToken(USER_MODEL_NAME),
          useValue: class {
            static create = jest.fn();
            static find = jest.fn();
            static findOne = jest.fn();
            static findById = jest.fn();
            static findByIdAndRemove = jest.fn();
            static findByIdAndUpdate = jest.fn();
            static exec = jest.fn();
            static updateOne = jest.fn();
          },
        },
      ],
    }).compile();

    service = module.get(UserService);
    model = module.get(getModelToken(USER_MODEL_NAME));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockReturnValueOnce(USER_DOCUMENTS[0] as any);
    const newUser = await service.create(USERS[0]);
    expect(newUser).toEqual(USER_DOCUMENTS[0]);
  });

  it('should delete a user successfully', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS[0]),
      }) as any,
    );
    expect(await service.delete(USER_DOCUMENTS[0]._id!)).toEqual(USER_DOCUMENTS[0]);
  });

  it('should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(USER_DOCUMENTS);
  });

  it('should find one by id', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS[0]),
      }) as any,
    );
    const foundUser = await service.findOne(USER_DOCUMENTS[0]._id!);
    expect(foundUser).toEqual(USER_DOCUMENTS[0]);
  });

  it('should find one by firebaseId', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS[0]),
      }) as any,
    );
    const foundUser = await service.findOneByFirebaseId(USER_DOCUMENTS[0].firebaseId!);
    expect(foundUser).toEqual(USER_DOCUMENTS[0]);
  });

  it('should update a user successfully', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS[0]),
      }) as any,
    );
    const updatedUser = await service.update(USER_DOCUMENTS[0]._id!, USERS[0]);
    expect(updatedUser).toEqual(USER_DOCUMENTS[0]);
  });

  it('should add a new user availability source', async () => {
    const userDoc = mockUserDocument({
      ...USER_DOCUMENTS[0],
      availability: [{ _id: id('UID_Alpha'), type: 'ical', uri: 'uri://test' } as UserAvailabilityDocument],
    });

    jest.spyOn(model, 'findById').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(userDoc),
      }) as any,
    );

    await service.addUserAvailability(userDoc._id!, [
      { type: 'ical', uri: 'uri://another' } as UserAvailabilityDocument,
    ]);
    expect(userDoc.availability).toEqual([
      { type: 'ical', uri: 'uri://test' },
      { type: 'ical', uri: 'uri://another' },
    ]);
  });

  it('should not add a duplicate user availability source', async () => {
    const userDoc = mockUserDocument({
      ...USER_DOCUMENTS[0],
      availability: [{ type: 'ical', uri: 'uri://test' } as UserAvailabilityDocument],
    });

    jest.spyOn(model, 'findById').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(userDoc),
      }) as any,
    );

    await service.addUserAvailability(userDoc._id!, [{ type: 'ical', uri: 'uri://test' } as UserAvailabilityDocument]);
    expect(userDoc.availability).toEqual([{ type: 'ical', uri: 'uri://test' } as UserAvailabilityDocument]);
  });

  it('should save a newly added user availability source', async () => {
    const userDoc = mockUserDocument(USER_DOCUMENTS[0]);

    jest.spyOn(model, 'findById').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(userDoc),
      }) as any,
    );

    const spy = jest.spyOn(userDoc, 'save');
    await service.addUserAvailability(userDoc._id!, [{ type: 'ical', uri: 'uri://test' } as UserAvailabilityDocument]);
    expect(spy).toBeCalled();
  });
});
