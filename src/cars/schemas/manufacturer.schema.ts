import * as mongoose from 'mongoose';

export interface IManufacturer {
  readonly phone: String;
  readonly name: String;
  readonly siret: Number;
}

export class Manufacturer extends mongoose.Document {
  readonly phone: String;
  readonly name: String;
  readonly siret: Number;
}

export const ManufacturerSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  name: { type: String, required: true },
  siret: { type: Number, required: true },
});

export const ManufacturerModel = mongoose.model(
  'Manufacturer',
  ManufacturerSchema,
);
