import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseRepository } from './base-repository';
import { Manufacturer } from '../../schemas';

import { Model } from 'mongoose';

@Injectable()
export class ManufacturersRepository extends BaseRepository<Manufacturer> {
  constructor(
    @InjectModel('Manufacturer') private manufacturerModel: Model<Manufacturer>,
  ) {
    super(manufacturerModel);
  }
}
