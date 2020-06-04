import * as mongoose from 'mongoose';
import { IOwner, Owner } from './owner.schema';
import { IManufacturer, Manufacturer } from './manufacturer.schema';

export interface ICar {
  readonly price: number;
  readonly manufacturer: IManufacturer;
  readonly firstRegistrationDate: Date;
  readonly owners: IOwner[];
}

export class Car extends mongoose.Document {
  readonly price: number;
  readonly manufacturer: Manufacturer;
  readonly firstRegistrationDate: Date;
  readonly owners: Owner[];
}

export const CarSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  manufacturer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Manufacturer',
    required: true,
  },
  firstRegistrationDate: { type: Date, required: true, default: Date.now },
  owners: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Owner' }],
});

export const CarModel = mongoose.model('Car', CarSchema);
