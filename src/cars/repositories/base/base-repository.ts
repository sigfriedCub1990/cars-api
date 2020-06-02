import { IWrite } from '../interfaces/IWrite';
import { IRead } from '../interfaces/IRead';

import {
  Document,
  Model,
  MongooseUpdateQuery,
  MongooseFilterQuery,
} from 'mongoose';

export class BaseRepository<T extends Document> implements IWrite<T>, IRead<T> {
  private readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(itemData: T): Promise<T> {
    const newItem = new this.model(itemData);
    return newItem.save();
  }

  async update(id: string, item: MongooseUpdateQuery<T>): Promise<T> {
    return this.model.updateOne({ _id: id } as MongooseFilterQuery<T>, item);
  }

  async delete(id: string): Promise<boolean> {
    const { ok } = await this.model
      .deleteOne({ _id: id } as MongooseFilterQuery<T>)
      .exec();
    return ok === 1;
  }

  async find(searchParams?: any): Promise<T[]> {
    return this.model.find(searchParams).exec();
  }

  async findOne(id: string): Promise<T> {
    return this.model.findOne({ _id: id } as MongooseFilterQuery<T>).exec();
  }
}
