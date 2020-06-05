import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as mongoose from 'mongoose';

const createFakeData = async connection => {
  const [ownerId, manufacturerId] = await Promise.all([
    new connection.models.Owner({
      name: 'John Carmack',
      firstPurchaseDate: new Date(),
    }).save(),
    new connection.models.Manufacturer({
      name: 'Scuderia Ferrari',
      phone: '+4 202 234234',
      siret: 200,
    }).save(),
  ]);

  const { id: carId } = await connection.models
    .Car({
      firstRegistrationDate: new Date(),
      manufacturer: manufacturerId,
      owners: [ownerId],
      price: 500000,
    })
    .save();

  return {
    carId,
    ownerId,
    manufacturerId,
  };
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection;
  let createdCarId: string;
  let ownerId: string;
  let manufacturerId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = await mongoose.connect('mongodb://localhost/carsAPI', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const {
      carId: car,
      ownerId: owner,
      manufacturerId: manufacturer,
    } = await createFakeData(connection);

    createdCarId = car;
    ownerId = owner;
    manufacturerId = manufacturer;

    await app.init();
  });

  afterAll(async () => {
    app.close();
    mongoose.connection.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('This is index controller');
  });

  it('/cars (POST)', () => {
    return request(app.getHttpServer())
      .post('/cars')
      .send({
        price: 200000,
        manufacturer: manufacturerId,
        firstRegistrationDate: '2014-05-20',
        owners: [ownerId],
      })
      .expect(200)
      .expect(res => {
        const { id, message } = res.body;
        expect(id).toHaveLength(24);
        expect(message).toBe('Car successfully created');
      });
  });

  it('/cars (GET)', () => {
    return request(app.getHttpServer())
      .get('/cars')
      .expect(200)
      .expect(res => {
        const { cars } = res.body;
        expect(cars.length).toBeGreaterThanOrEqual(0);
      });
  });

  /**
   * This test will fail since `fjasjdfasdf` is
   * and invalid ObjectID
   */
  it('/cars/id (GET)', () => {
    return request(app.getHttpServer())
      .get('/cars/fjasjdfasdf')
      .expect(404);
  });

  it('/cars/id (GET)', async () => {
    const { carId } = await createFakeData(connection);
    return request(app.getHttpServer())
      .get(`/cars/${carId}`)
      .expect(200);
  });

  it('/cars/procedure (GET)', () => {
    return request(app.getHttpServer())
      .get('/cars/procedure')
      .expect(200)
      .expect({
        message: 'Operation succeeded',
      });
  });

  it('/cars/id (PUT)', () => {
    return request(app.getHttpServer())
      .put(`/cars/${createdCarId}`)
      .send({
        price: 300,
      })
      .expect(200)
      .expect(res => {
        const { message } = res.body;
        expect(message).toBe('Car successfully updated');
      });
  });

  it('/cars/id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/cars/${createdCarId}`)
      .expect(200)
      .expect({
        message: 'Car removed',
      });
  });
});
