import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { CarsService } from './cars.service';
import { CarsRepository } from './repositories/base/cars-repository';
import { OwnersRepository } from './repositories/base/owners-repository';

import { mockOwner, mockCar, mockManufacturer } from './utils/test/mocks';
import { Car, Manufacturer } from './schemas';

const carsMockArray = [
  mockCar(),
  mockCar(
    'id-2',
    new Date('2019-05-05'),
    mockManufacturer(),
    [mockOwner()],
    250000,
  ),
  mockCar(
    'id-3',
    new Date('2018-05-15'),
    mockManufacturer(),
    [mockOwner('Eva Martorell', new Date('2020-05-27'))],
    350000,
  ),
];

describe('CarsService', () => {
  let service: CarsService;
  let repository: CarsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        CarsRepository,
        {
          provide: getModelToken('Car'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockCar()),
            constructor: jest.fn().mockResolvedValue(mockCar()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            findManufacturer: jest.fn(),
          },
        },
        OwnersRepository,
        {
          provide: getModelToken('Owner'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockOwner()),
            constructor: jest.fn().mockResolvedValue(mockOwner()),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    repository = module.get<CarsRepository>(CarsRepository);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all Cars', async () => {
    jest
      .spyOn(repository, 'find')
      .mockImplementationOnce(() => Promise.resolve(carsMockArray) as any);
    const cars = await service.findAll();

    expect(cars).toStrictEqual(carsMockArray);
  });

  it('should return a Car', async () => {
    const { price, manufacturer, owners, firstRegistrationDate } = mockCar();
    const mockedCar = {
      price,
      manufacturer,
      owners,
      firstRegistrationDate,
    };

    jest
      .spyOn(repository, 'findOne')
      .mockImplementationOnce(() => Promise.resolve(mockedCar as any));

    const car = await service.findById('some-mocked-id');

    expect(mockedCar).toStrictEqual(car);
  });

  it('should create a Car', async () => {
    jest.spyOn(repository, 'create').mockResolvedValueOnce({
      id: 'mocked-uuid',
    } as any);

    const car = await service.create({
      manufacturer: 'mocked-manufacturer-uuid',
      firstRegistrationDate: new Date('2020-05-04'),
      owners: ['mocked-owner-uuid'],
    });

    expect(car).toStrictEqual({ id: 'mocked-uuid' });
  });

  it('should remove a Car', async () => {
    jest.spyOn(repository, 'delete').mockResolvedValueOnce(true);

    const returnedValue = await service.removeCar('some-mocked-id');

    expect(returnedValue).toBe(true);
  });

  it('should return the Car manufacturer', async () => {
    const mockedManufacturer = mockManufacturer();

    jest
      .spyOn(repository, 'findManufacturer')
      .mockImplementationOnce(() =>
        Promise.resolve(mockedManufacturer as Manufacturer),
      );

    const manufacturer = await service.findManufacturer('some-mocked-id');

    expect(manufacturer).toStrictEqual(mockedManufacturer);
  });
});
