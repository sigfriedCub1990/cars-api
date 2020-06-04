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

export const mockCar: (
  id?: string,
  firstRegistrationDate?: Date,
  manufacturer?: IManufacturer,
  owners?: IOwner[],
  price?: number,
) => ICar = (
  id = 'some-mocked-uuid',
  firstRegistrationDate = new Date(),
  manufacturer = {
    name: 'Moskvich',
    phone: '+7 202 234234',
    siret: 200,
  },
  owners = [
    {
      name: 'Iosif Stalin',
      purchaseDate: new Date('1944-05-05'),
    },
    {
      name: 'Rick Deckard',
      purchaseDate: new Date('2020-05-05'),
    },
  ],
  price = 20000000,
) => {
  return {
    id,
    firstRegistrationDate,
    manufacturer,
    owners,
    price,
  };
};
