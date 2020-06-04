import { Injectable } from '@nestjs/common';

import { Car, Owner, Manufacturer, ICar, IManufacturer } from './schemas';
import { CarsRepository } from './repositories/base/cars-repository';
import { OwnersRepository } from './repositories/base/owners-repository';

import moment = require('moment');
import _ = require('lodash');
import { CarDto } from './car.dto';

@Injectable()
export class CarsService {
  constructor(
    private carsRepository: CarsRepository,
    private ownerRepository: OwnersRepository,
  ) {}

  async create(carData: CarDto): Promise<Car> {
    return this.carsRepository.create(carData);
  }

  async updateCar(id: string, carData: CarDto): Promise<any> {
    try {
      await this.carsRepository.update(id, carData);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async removeCar(id: string): Promise<boolean> {
    return this.carsRepository.delete(id);
  }

  async findById(id: string): Promise<ICar> {
    try {
      const car = await this.carsRepository.findOne(id);
      return {
        price: car.price,
        manufacturer: {
          name: car.manufacturer.name,
          phone: car.manufacturer.phone,
          siret: car.manufacturer.siret,
        },
        owners: car.owners.map(owner => ({
          name: owner.name,
          purchaseDate: owner.purchaseDate,
        })),
        firstRegistrationDate: car.firstRegistrationDate,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findManufacturer(id: string): Promise<IManufacturer> {
    try {
      const manufacturer: Manufacturer = await this.carsRepository.findManufacturer(
        id,
      );
      return {
        name: manufacturer.name,
        phone: manufacturer.phone,
        siret: manufacturer.siret,
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findAll(): Promise<ICar[]> {
    try {
      const cars: Car[] = await this.carsRepository.find();
      return cars.map(car => ({
        id: car.id,
        price: car.price,
        firstRegistrationDate: car.firstRegistrationDate,
        manufacturer: {
          name: car.manufacturer.name,
          phone: car.manufacturer.phone,
          siret: car.manufacturer.siret,
        },
        owners: car.owners.map(owner => ({
          name: owner.name,
          purchaseDate: owner.purchaseDate,
        })),
      }));
    } catch (err) {
      throw new Error(err.message);
    }
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
