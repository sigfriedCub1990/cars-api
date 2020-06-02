import * as mongoose from 'mongoose';
import { Manufacturer, Owner } from '../schemas';

export interface ICar {
  readonly price: number;
  readonly manufacturer: string;
  readonly firstRegistrationDate: Date;
  readonly owners: string[];
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
