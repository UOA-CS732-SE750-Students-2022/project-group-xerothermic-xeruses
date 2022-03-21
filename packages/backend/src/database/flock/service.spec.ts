import { createMock } from '@golevelup/ts-jest';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query, Types } from 'mongoose';
import { FLOCK_MODEL_NAME, FlockDocument, Flock, FlockService } from '.';

const id = (id: string) => {
  if (id.length > 12) throw new Error('ObjectID length must not exceed 12 characters.');
  return new Types.ObjectId(id.padEnd(12, '_'));
};

const mockFlock = (mock?: Partial<Flock>): Flock => ({
  _id: mock?._id || id('FID_Alpha'),
  name: mock?.name || '<flock name Alpha>',
  users: mock?.users || [],
});

const mockFlockDocument = (mock?: Partial<Flock>): Partial<FlockDocument> => ({
  _id: mock?._id || id('FID_Alpha'),
  name: mock?.name || '<flock name Alpha>',
  users: mock?.users || [],
});

const FLOCKS = [
  mockFlock(),
  mockFlock({ _id: id('FID_Bravo'), name: '<flock name Bravo>', users: [] }),
  mockFlock({ _id: id('FID_Charlie'), name: '<flock name Charlie>', users: [] }),
];

const FLOCK_DOCUMENTS = FLOCKS.map(mockFlockDocument);

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
            save = jest.fn().mockReturnValue(FLOCK_DOCUMENTS[0]);
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
    const newUser = await service.create(FLOCKS[0]);
    expect(newUser).toEqual(FLOCK_DOCUMENTS[0]);
  });

  it('should delete a flock successfully', async () => {
    jest.spyOn(model, 'findByIdAndRemove').mockReturnValueOnce(
      createMock<Query<FlockDocument, FlockDocument>>({
        exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS[0]),
      }) as any,
    );
    expect(await service.delete(FLOCKS[0])).toEqual(FLOCK_DOCUMENTS[0]);
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
    const foundFlock = await service.findOne(FLOCKS[0]._id);
    expect(foundFlock).toEqual(FLOCK_DOCUMENTS[0]);
  });

  it('should update a flock successfully', async () => {
    jest.spyOn(model, 'findByIdAndUpdate').mockReturnValueOnce(
      createMock<Query<FlockDocument, FlockDocument>>({
        exec: jest.fn().mockResolvedValueOnce(FLOCK_DOCUMENTS[0]),
      }) as any,
    );
    const updatedFlock = await service.update(FLOCKS[0]);
    expect(updatedFlock).toEqual(FLOCK_DOCUMENTS[0]);
  });
});
