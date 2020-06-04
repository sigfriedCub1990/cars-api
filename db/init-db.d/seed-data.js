db.cars.insertMany([
  {
    _id: ObjectId('5ed92f14db40b951d5b732b4'),
    owners: [
      ObjectId('5ed92e60f032a66f5b4ef27f'),
      ObjectId('5ed92c15f032a66f5b4ef275'),
    ],
    price: NumberInt(500000),
    manufacturer: ObjectId('5ed92c35f032a66f5b4ef276'),
    firstRegistrationDate: ISODate('1991-05-20T00:00:00.000+0000'),
    __v: NumberInt(0),
  },
  {
    _id: ObjectId('5ed92e1edb40b951d5b732b3'),
    owners: [
      ObjectId('5ed92bcbf032a66f5b4ef273'),
      ObjectId('5ed92bf0f032a66f5b4ef274'),
    ],
    price: NumberInt(200000),
    manufacturer: ObjectId('5ed92b7ef032a66f5b4ef26e'),
    firstRegistrationDate: ISODate('2018-05-20T00:00:00.000+0000'),
    __v: NumberInt(0),
  },
  {
    _id: ObjectId('5ed91b77041beb60bf8426f2'),
    owners: [ObjectId('5ed91b4cf032a66f5b4ef23a')],
    price: NumberInt(160000),
    manufacturer: ObjectId('5ed91b2ff032a66f5b4ef239'),
    firstRegistrationDate: ISODate('2018-05-20T00:00:00.000+0000'),
    __v: NumberInt(0),
  },
]);

db.owners.insertMany([
  {
    _id: ObjectId('5ed92c15f032a66f5b4ef275'),
    name: 'John Carmack',
    purchaseDate: ISODate('1992-05-04T00:00:00.000+0000'),
  },
  {
    _id: ObjectId('5ed92bf0f032a66f5b4ef274'),
    name: 'Vasily Tsaitzev',
    purchaseDate: '1944-04-27',
  },
  {
    _id: ObjectId('5ed92bcbf032a66f5b4ef273'),
    name: 'Iosif Stalin',
    purchaseDate: ISODate('1940-05-04T00:00:00.000+0000'),
  },
  {
    _id: ObjectId('5ed91b4cf032a66f5b4ef23a'),
    name: 'Elon Musk',
    purchaseDate: ISODate('2018-05-19T00:00:00.000+0000'),
  },
  {
    _id: ObjectId('5ed92e60f032a66f5b4ef27f'),
    name: 'Ruben Garcia',
    purchaseDate: ISODate('2020-04-27T00:00:00.000+0000'),
  },
]);

db.manufacturers.insertMany([
  {
    _id: ObjectId('5ed92c35f032a66f5b4ef276'),
    name: 'Scuderia Ferrari',
    phone: '+4 23404234',
    siret: 150.0,
  },
  {
    _id: ObjectId('5ed92b7ef032a66f5b4ef26e'),
    name: 'Moskvich',
    phone: '+7 234230234',
    siret: 40.0,
  },
  {
    _id: ObjectId('5ed92b57f032a66f5b4ef26d'),
    name: 'Lada',
    phone: '+7 023423454',
    siret: 50.0,
  },
  {
    _id: ObjectId('5ed92b33f032a66f5b4ef26c'),
    name: 'Nissan',
    phone: '01234234',
    siret: 100.0,
  },
  {
    _id: ObjectId('5ed91b2ff032a66f5b4ef239'),
    name: 'Tesla, Inc',
    phone: '+1 (202) 444 4445',
    siret: 200.0,
  },
]);
