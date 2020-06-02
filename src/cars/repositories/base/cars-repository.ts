import { Injectable } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Car, Manufacturer } from 'src/cars/schemas';
import { BaseRepository } from './base-repository';

@Injectable()
export class CarsRepository extends BaseRepository<Car> {
  constructor(@InjectModel('Car') private carModel: Model<Car>) {
    super(carModel);
  }

  async find(searchParams?: Object): Promise<Car[]> {
    return this.carModel
      .find(searchParams)
      .populate('manufacturer')
      .populate('owners')
      .exec();
  }

  async findManufacturer(id: string): Promise<Manufacturer> {
    const car = await super.findOne(id);
    const { manufacturer } = await car.populate('manufacturer').execPopulate();

    return manufacturer;
  }
}
