import { ICar, IOwner, IManufacturer } from '../../schemas';

export const mockOwner: (name?: string, purchaseDate?: Date) => IOwner = (
  name = 'Telsa, Inc',
  purchaseDate = new Date(),
) => {
  return {
    name,
    purchaseDate,
  };
};

export const mockCar: (
  id?: string,
  firstRegistrationDate?: Date,
  manufacturer?: string,
  owners?: string[],
  price?: number,
) => ICar = (
  id = 'some-mocked-uuid',
  firstRegistrationDate = new Date(),
  manufacturer: '5ed2b34cda96ab0fc8f95dbb',
  owners: ['5ed636a8c91ac95f2f5c9d96'],
  price: 20000000,
) => {
  return {
    id,
    firstRegistrationDate,
    manufacturer,
    owners,
    price,
  };
};

export const mockManufacturer: (
  phone?: string,
  name?: string,
  siret?: number,
) => IManufacturer = (
  phone = '+1 (202) 512 2344',
  name = 'Tesla, Inc',
  siret = 2000,
) => {
  return {
    phone,
    name,
    siret,
  };
};
