import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { CarsService } from './cars.service';
import { CarsRepository } from './repositories/base/cars-repository';
import { OwnersRepository } from './repositories/base/owners-repository';

import { mockOwner, mockCar, mockManufacturer } from './utils/test/mocks';

const carsMockArray = [
  mockCar(),
  mockCar(new Date('2019-05-05'), 'Ford Motors', ['Ruben Garcia'], 250000),
  mockCar(new Date('2018-05-15'), 'Nissan', ['Eva Martorell'], 350000),
];

describe('CarsService', () => {
  let service: CarsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsRepository,
        OwnersRepository,
        {
          provide: getModelToken('Owner'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockOwner()),
            constructor: jest.fn().mockResolvedValue(mockOwner()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        CarsService,
        {
          provide: getModelToken('Car'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockCar()),
            constructor: jest.fn().mockResolvedValue(mockCar()),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all Cars', async () => {
    jest
      .spyOn(service, 'findAll')
      .mockImplementation(jest.fn().mockResolvedValueOnce(carsMockArray));
    const cars = await service.findAll();

    expect(cars).toBe(carsMockArray);
  });

  it('should return a Car', async () => {
    const carMock = mockCar();
    jest
      .spyOn(service, 'findById')
      .mockImplementation(jest.fn().mockResolvedValueOnce(carMock));

    const car = await service.findById('some-mocked-id');

    expect(car).toBe(carMock);
  });

  it('should remove a Car', async () => {
    jest
      .spyOn(service, 'removeCar')
      .mockImplementation(jest.fn().mockResolvedValueOnce(true));

    const returnedValue = await service.removeCar('some-mocked-id');

    expect(returnedValue).toBe(true);
  });

  it('should return the Car manufacturer', async () => {
    const mockedManufacturer = mockManufacturer();
    jest
      .spyOn(service, 'findManufacturer')
      .mockImplementation(jest.fn().mockResolvedValueOnce(mockedManufacturer));

    const manufacturer = await service.findManufacturer('some-mocked-id');

    expect(manufacturer).toBe(mockedManufacturer);
  });
});
