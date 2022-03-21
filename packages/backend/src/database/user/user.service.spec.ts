import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query, Types } from 'mongoose';
import { User, UserDocument, USER_MODEL_NAME } from './user.schema';
import { UserService } from './user.service';

const id = (id: string) => {
  if (id.length > 12) throw new Error('ObjectID length must not exceed 12 characters.');
  return new Types.ObjectId(id.padEnd(12, '_'));
};

const mockUser = (mock?: Partial<User>): User => ({
  _id: mock?._id || id('UID_Alpha'),
  name: mock?.name || '<user name Alpha>',
  flocks: [],
  flockInvites: [],
  availability: [],
});

const mockUserDocument = (mock?: Partial<User>): Partial<UserDocument> => ({
  _id: mock?._id || id('UID_Alpha'),
  name: mock?.name || '<user name Alpha>',
  flocks: mock?.flocks || [],
  flockInvites: mock?.flockInvites || [],
  availability: mock?.availability || [],
});

const USERS = [
  mockUser(),
  mockUser({ _id: id('UID_Bravo'), name: '<user uuid Bravo>' }),
  mockUser({ _id: id('UID_Charlie'), name: '<user uuid Charlie>' }),
];

const USER_DOCUMENTS = USERS.map(mockUserDocument);

describe(UserService.name, () => {
  let service: UserService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(USER_MODEL_NAME),
          useValue: class {
            static create = jest.fn();
            static find = jest.fn();
            static findById = jest.fn();
            static findByIdAndRemove = jest.fn();
            static findByIdAndUpdate = jest.fn();
            static exec = jest.fn();
            save = jest.fn().mockReturnValue(USER_DOCUMENTS[0]);
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

  //

  it('should insert a new flock', async () => {
    const newUser = await service.create(USERS[0]);
    expect(newUser).toEqual(USER_DOCUMENTS[0]);
  });

  it('should delete a flock successfully', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS[0]),
      }) as any,
    );
    expect(await service.delete(USERS[0])).toEqual(USER_DOCUMENTS[0]);
  });

  it('should return all flocks', async () => {
    jest.spyOn(model, 'find').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS),
    } as any);
    const flocks = await service.findAll();
    expect(flocks).toEqual(USER_DOCUMENTS);
  });

  it('should find one by id', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(mockUserDocument(USER_DOCUMENTS[0])),
      }) as any,
    );
    const foundUser = await service.findOne(USERS[0]._id);
    expect(foundUser).toEqual(USER_DOCUMENTS[0]);
  });

  it('should update a flock successfully', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValueOnce(USER_DOCUMENTS[0]),
      }) as any,
    );
    const updatedUser = await service.update(USERS[0]);
    expect(updatedUser).toEqual(USER_DOCUMENTS[0]);
  });
});
