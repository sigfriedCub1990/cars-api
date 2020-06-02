import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseRepository } from './base-repository';
import { Owner } from '../../schemas';

import { Model } from 'mongoose';

@Injectable()
export class OwnersRepository extends BaseRepository<Owner> {
  constructor(@InjectModel('Owner') private ownerModel: Model<Owner>) {
    super(ownerModel);
  }
}
