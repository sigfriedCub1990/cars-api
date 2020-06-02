import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarSchema, OwnerSchema, ManufacturerSchema } from './schemas';
import { CarsService } from './cars.service';
import { CarsRepository } from './repositories/base/cars-repository';
import { ManufacturersRepository } from './repositories/base/manufacturer-repository';
import { OwnersRepository } from './repositories/base/owners-repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Car', schema: CarSchema },
      { name: 'Owner', schema: OwnerSchema },
      { name: 'Manufacturer', schema: ManufacturerSchema },
    ]),
  ],
  controllers: [CarsController],
  providers: [
    CarsRepository,
    ManufacturersRepository,
    OwnersRepository,
    CarsService,
  ],
})
export class CarsModule {}
