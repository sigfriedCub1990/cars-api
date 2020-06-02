import * as mongoose from 'mongoose';

export interface IOwner {
  readonly name: String;
  readonly purchaseDate: Date;
}

export class Owner extends mongoose.Document {
  readonly name: String;
  readonly purchaseDate: Date;
}

export const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  purchaseDate: { type: Date, default: Date.now },
});

export const OwnerModel = mongoose.model('Owner', OwnerSchema);
