export interface IRead<T> {
  find(searchCriteria: T): Promise<T[]>;
  findOne(id: string): Promise<T>;
}
