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

  it('should find one by firebaseId', async () => {
    const user: FlockDocument | null = await service.findOneByCode(flockDocument.flockCode!);

    expect(user).toBeTruthy();
    checkEquality(user!, flockDocument);
  });

  it('should update a user successfully', async () => {
    const user: FlockDocument | null = await service.update(flockDocument._id!, {
      name: 'New Name',
    });

    const updatedFlockDocument: Partial<FlockDocument> = flockDocument;
    updatedFlockDocument.name = 'New Name';

    expect(user).toBeTruthy();
    checkEquality(user!, updatedFlockDocument);
  });

  it('should delete a user successfully', async () => {
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

// /* eslint-disable @typescript-eslint/no-non-null-assertion */

// import { createMock } from '@golevelup/ts-jest';
// import { getModelToken } from '@nestjs/mongoose';
// import { Test, type TestingModule } from '@nestjs/testing';
// import { type Model, type Query, Types } from 'mongoose';
// import { FlockUtil } from '~/util/flock.util';
// import { type Flock, type FlockDocument, FLOCK_MODEL_NAME } from './flock.schema';
// import { FlockService } from './flock.service';

// const mockFlockDays = [
//   {
//     start: new Date(Date.UTC(2022, 9, 2, 10)),
//     end: new Date(Date.UTC(2022, 9, 2, 16)),
//   },
// ];

// const id = (id: string) => {
//   if (id.length > 12) throw new Error('ObjectID length must not exceed 12 characters.');
//   return new Types.ObjectId(id.padEnd(12, '_'));
// };

// const mockFlock = (mock?: Partial<Flock>): Flock => ({
//   name: mock?.name || '<flock name Alpha>',
//   flockDays: mock?.flockDays || mockFlockDays,
//   flockCode: mock?.flockCode || '<flock flockCode Alpha>',
//   users: mock?.users || [],
//   userFlockAvailability: mock?.userFlockAvailability || [],
// });

// const mockFlockDocument = (mock?: Partial<FlockDocument>): Partial<FlockDocument> => ({
//   _id: mock?._id || id('FID_Alpha'),
//   name: mock?.name || '<flock name Alpha>',
//   flockDays: mock?.flockDays || mockFlockDays,
//   flockCode: mock?.flockCode || '<flock flockCode Alpha>',
//   users: mock?.users || [],
//   userFlockAvailability: mock?.userFlockAvailability || [],
// });

// const FLOCK_DOCUMENTS = [
//   mockFlockDocument(),
//   mockFlockDocument({ _id: id('FID_Bravo'), name: '<flock name Bravo>', users: [] }),
//   mockFlockDocument({ _id: id('FID_Charlie'), name: '<flock name Charlie>', users: [] }),
// ];

// const FLOCKS = FLOCK_DOCUMENTS.map(mockFlock);

// describe(FlockService.name, () => {
//   let service: FlockService;
//   let util: FlockUtil;
//   let model: Model<FlockDocument>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         FlockService,
//         FlockUtil,
//         {
//           provide: getModelToken(FLOCK_MODEL_NAME),
//           useValue: class {
//             static create = jest.fn();
//             static find = jest.fn();
//             static findOne = jest.fn();
//             static findById = jest.fn();
//             static findByIdAndRemove = jest.fn();
//             static findByIdAndUpdate = jest.fn();
//             static exec = jest.fn();
//           },
//         },
//       ],
//     }).compile();

//     service = module.get(FlockService);
//     util = module.get(FlockUtil);
//     model = module.get(getModelToken(FLOCK_MODEL_NAME));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   //

//   it('should insert a new flock', async () => {
//     jest.spyOn(model, 'create').mockReturnValueOnce(FLOCK_DOCUMENTS[0] as any);
//     jest.spyOn(model, 'findOne').mockReturnValueOnce(null as any);
//     jest.spyOn(util, 'generateFlockCode').mockReturnValueOnce('<flock flockCode Alpha>' as any);
//     const newFlock = await service.create(FLOCKS[0]);
//     expect(newFlock).toEqual(FLOCK_DOCUMENTS[0]);
//   });

//   it('should delete a flock successfully', async () => {
//     jest.spyOn(model, 'findByIdAndRemove').mockReturnValueOnce(
//       createMock<Query<FlockDocument, FlockDocument>>({
//         exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS[0]),
//       }) as any,
//     );
//     expect(await service.delete(FLOCK_DOCUMENTS[0]._id!)).toEqual(FLOCK_DOCUMENTS[0]);
//   });

//   it('should return all flocks', async () => {
//     jest.spyOn(model, 'find').mockReturnValueOnce({
//       exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS),
//     } as any);
//     const flocks = await service.findAll();
//     expect(flocks).toEqual(FLOCK_DOCUMENTS);
//   });

//   it('should find one by id', async () => {
//     jest.spyOn(model, 'findById').mockReturnValueOnce(
//       createMock<Query<FlockDocument, FlockDocument>>({
//         exec: jest.fn().mockResolvedValueOnce(mockFlockDocument(FLOCK_DOCUMENTS[0])),
//       }) as any,
//     );
//     const foundFlock = await service.findOne(FLOCK_DOCUMENTS[0]._id!);
//     expect(foundFlock).toEqual(FLOCK_DOCUMENTS[0]);
//   });

//   it('should update a flock successfully', async () => {
//     jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
//       createMock<Query<FlockDocument, FlockDocument>>({
//         exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS[0]),
//       }) as any,
//     );
//     const updatedFlock = await service.update(FLOCK_DOCUMENTS[0]._id!, FLOCKS[0]);
//     expect(updatedFlock).toEqual(FLOCK_DOCUMENTS[0]);
//   });
// });
