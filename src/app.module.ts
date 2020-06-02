import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/carsAPI'), CarsModule],
  controllers: [AppController],
})
export class AppModule {}
