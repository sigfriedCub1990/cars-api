import { MongooseUpdateQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';

import { Car, Owner, Manufacturer } from './schemas';
import { CarsRepository } from './repositories/base/cars-repository';
import { OwnersRepository } from './repositories/base/owners-repository';

import moment = require('moment');
import _ = require('lodash');

@Injectable()
export class CarsService {
  constructor(
    private carsRepository: CarsRepository,
    private ownerRepository: OwnersRepository,
  ) {}

  async create(carData: Car): Promise<Car> {
    return this.carsRepository.create(carData);
  }

  async updateCar(id: string, carData: Car): Promise<Car> {
    const mongoData: MongooseUpdateQuery<Car> = carData;
    return this.carsRepository.update(id, mongoData);
  }

  async removeCar(id: string): Promise<boolean> {
    return this.carsRepository.delete(id);
  }

  async findById(id: string): Promise<Car> {
    return this.carsRepository.findOne(id);
  }

  async findManufacturer(id: string): Promise<Manufacturer> {
    return this.carsRepository.findManufacturer(id);
  }

  async findAll(): Promise<Car[]> {
    return this.carsRepository.find();
  }

  async updateOwnersAndApplyDiscounts() {
    try {
      await Promise.all([this.removeOwners(), this.applyDiscounts()]);
    } catch (err) {
      return new Error(err.message);
    }
  }

  /**
   * This function removes all the owners that bought
   * the cars before the last 18 months.
   */
  private async removeOwners() {
    const today = moment();
    const monthsBack = today.subtract('18', 'months').toISOString();

    const cars = await this.carsRepository.find();

    const ownersArray: Array<Owner[]> = [];

    for (let i = 0; i < cars.length; i++) {
      let carInstance = cars[i];
      let owners = await this.ownerRepository.find({
        $and: [
          { _id: { $in: carInstance.owners } },
          { purchaseDate: { $lte: new Date(monthsBack) } },
        ],
      });
      ownersArray.push(owners);
    }
    const ownersFlatArray = _.flattenDeep(ownersArray);

    ownersFlatArray.forEach(owner => owner.remove());
  }

  /**
   * This function applies a discount to all cars
   * that have a `firstRegistration` date between
   * 12 and 18 months
   */
  private async applyDiscounts() {
    const today = moment();
    const eighteenMonthsBack = today.subtract('18', 'months').toISOString();
    const twelveMonthsBack = today.subtract('12', 'months').toISOString();

    const cars = await this.carsRepository.find({
      $and: [
        { firstRegistrationDate: { $lte: new Date(eighteenMonthsBack) } },
        { firstRegistrationDate: { $gte: new Date(twelveMonthsBack) } },
      ],
    });

    for (let i = 0; i < cars.length; i++) {
      let carInstance = cars[i];
      let carDiscount = carInstance.price * 0.2;
      let newCarPrice = carInstance.price - carDiscount;
      await this.carsRepository.update(carInstance.id, { price: newCarPrice });
    }
  }
}
