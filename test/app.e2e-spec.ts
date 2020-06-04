import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdCarId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

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
        manufacturer: '5ed2b34cda96ab0fc8f95dbb',
        firstRegistrationDate: '2014-05-20',
        owners: ['5ed2b451d69ad9583ec00b2e'],
      })
      .expect(200)
      .expect(res => {
        const { id, message } = res.body;
        expect(id).toHaveLength(24);
        expect(message).toBe('Car successfully created');
        createdCarId = id;
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

  it('/cars/id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/cars/${createdCarId}`)
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
