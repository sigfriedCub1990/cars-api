import { Test } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Car, Owner } from './schemas';
import { CarsRepository } from './repositories/base/cars-repository';
import { OwnersRepository } from './repositories/base/owners-repository';
import { getModelToken } from '@nestjs/mongoose';

import { mockCar, mockOwner } from '../cars/utils/test/mocks';
import { Response } from 'express';

const mockedCarsList = [
  mockCar(),
  mockCar(
    'mocked-uuid-2',
    new Date('1984-05-29'),
    'General Motors',
    ['Steve Jobs', 'Paul McCartney'],
    200000,
  ),
  mockCar(
    'mocked-uuid-2',
    new Date('1984-05-29'),
    'Alfa Romeo',
    ['Steve Wozniak', 'George Harrison'],
    200000,
  ),
];

// Simply mocking the *@Res res: Response dependency*
const response = {
  status: code => code,
  json: json => ({ ...json }),
};

describe('Cars Controller', () => {
  let carsController: CarsController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CarsController],
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

    carsController = moduleRef.get<CarsController>(CarsController);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return an array of Cars', async () => {
    jest
      .spyOn(carsController, 'getCars')
      .mockImplementation(jest.fn().mockResolvedValueOnce(mockedCarsList));

    const resultList = await carsController.getCars(response as Response);

    expect(resultList).toBe(mockedCarsList);
  });

  it('should return a Car', async () => {
    jest
      .spyOn(carsController, 'getCar')
      .mockImplementation(jest.fn().mockResolvedValueOnce(mockedCarsList[0]));

    const resultList = await carsController.getCar(response as Response, {
      id: 'some-mocked-uuid',
    });

    expect(resultList).toBe(mockedCarsList[0]);
  });

  it('should return a Car manufacturer', async () => {
    const mockedCarOwner = mockOwner();
    jest
      .spyOn(carsController, 'getCarManufacturer')
      .mockImplementation(jest.fn().mockResolvedValueOnce(mockedCarOwner));

    const manufacturer = await carsController.getCarManufacturer({
      id: 'some-mocked-uuid',
    });

    expect(manufacturer).toBe(manufacturer);
  });

  it('should delete a Car', async () => {
    jest.spyOn(carsController, 'deleteCar').mockImplementation(
      jest.fn().mockResolvedValueOnce({
        message: 'Car removed',
      }),
    );

    const result = await carsController.deleteCar(response as Response, {
      id: 'some-mocked-uuid',
    });

    expect(result).toStrictEqual({
      message: 'Car removed',
    });
  });
});
