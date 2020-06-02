import { Test } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { Car } from './schemas';
import { CarsRepository } from './repositories/base/cars-repository';
import { OwnersRepository } from './repositories/base/owners-repository';

import { CarSchema, OwnerSchema, ManufacturerSchema } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';

describe('Cars Controller', () => {
  let carsController: CarsController;
  let carsService: CarsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: 'Car', schema: CarSchema },
          { name: 'Owner', schema: OwnerSchema },
          { name: 'Manufacturer', schema: ManufacturerSchema },
        ]),
      ],
      controllers: [CarsController],
      providers: [CarsRepository, OwnersRepository, CarsService],
    }).compile();

    carsService = moduleRef.get<CarsService>(CarsService);
    carsController = moduleRef.get<CarsController>(CarsController);
  });

  it('should return an array of Cars', async () => {});
});
