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

  async create(itemData): Promise<T> {
    const newItem = new this.model(itemData);
    return newItem.save();
  }

  async update(id: string, fieldsToUpdate): Promise<T> {
    const updateQuery: MongooseUpdateQuery<T> = fieldsToUpdate;
    return this.model.updateOne(
      { _id: id } as MongooseFilterQuery<T>,
      updateQuery,
    );
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
    return this.model.findById(id).exec();
  }
}
