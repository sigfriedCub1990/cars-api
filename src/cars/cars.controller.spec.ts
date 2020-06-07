import { Test } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarsRepository } from './repositories/base/cars-repository';
import { OwnersRepository } from './repositories/base/owners-repository';
import { getModelToken } from '@nestjs/mongoose';

import { mockCar, mockOwner, mockManufacturer } from '../cars/utils/test/mocks';
import { Response } from 'express';
import { createMock } from '@golevelup/ts-jest';

const mockedCarsList = [
  mockCar(),
  mockCar(
    'mocked-uuid-2',
    new Date('1984-05-29'),
    mockManufacturer(),
    [mockOwner(), mockOwner('Paul McCartney')],
    200000,
  ),
  mockCar(
    'mocked-uuid-2',
    new Date('1984-05-29'),
    mockManufacturer(),
    [
      mockOwner('Steve Wozniak', new Date('1990-04-27')),
      mockOwner('George Harrison', new Date('1972-04-05')),
    ],
    200000,
  ),
];

const mockResponseObject = () => {
  return createMock<Response>({
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  });
};

describe('Cars Controller', () => {
  let carsController: CarsController;
  let carsService: CarsService;

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
    carsService = moduleRef.get<CarsService>(CarsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should return an array of Cars', async () => {
    const response = mockResponseObject();

    jest
      .spyOn(carsService, 'findAll')
      .mockImplementation(jest.fn().mockResolvedValueOnce(mockedCarsList));

    await carsController.getCars(response);

    expect(response.json).toHaveBeenCalledTimes(1);
    expect(response.json).toHaveBeenCalledWith({ cars: mockedCarsList });
    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('should return a Car', async () => {
    const response = mockResponseObject();

    jest
      .spyOn(carsService, 'findById')
      .mockImplementation(jest.fn().mockResolvedValueOnce(mockedCarsList[0]));

    await carsController.getCar(response, {
      id: 'some-mocked-uuid',
    });

    expect(response.json).toHaveBeenCalledTimes(1);
    expect(response.json).toHaveBeenCalledWith(mockedCarsList[0]);
    expect(response.status).toHaveBeenCalledTimes(1);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  it('should return a Car manufacturer', async () => {
    const mockedCarOwner = mockOwner();
    jest
      .spyOn(carsService, 'findManufacturer')
      .mockImplementation(jest.fn().mockResolvedValueOnce(mockedCarOwner));

    const manufacturer = await carsController.getCarManufacturer({
      id: 'some-mocked-uuid',
    });

    expect(manufacturer).toBe(manufacturer);
  });

  it('should delete a Car', async () => {
    const response = mockResponseObject();

    jest
      .spyOn(carsService, 'removeCar')
      .mockImplementation(jest.fn().mockResolvedValueOnce(true));

    await carsController.deleteCar(response, {
      id: 'some-mocked-uuid',
    });

    expect(response.json).toHaveBeenCalledWith({
      message: 'Car removed',
    });
  });
});
