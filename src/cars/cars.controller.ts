import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { Car } from './schemas';
import { Response } from 'express';
import { CarDto } from './car.dto';

export interface CarPayloadParams {
  id: string;
}

@Controller('cars')
export class CarsController {
  constructor(private carsService: CarsService) {}

  @Get()
  async getCars(@Res() res: Response): Promise<any> {
    try {
      const carsArray = await this.carsService.findAll();
      return res.status(HttpStatus.OK).json({
        cars: carsArray,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/procedure')
  async procedure(@Res() res: Response) {
    try {
      await this.carsService.updateOwnersAndApplyDiscounts();
      return res.status(HttpStatus.OK).json({
        message: 'Operation succeeded',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/:id')
  async getCar(@Res() res: Response, @Param() params: CarPayloadParams) {
    try {
      const { id } = params;
      const car = await this.carsService.findById(id);
      return res.status(HttpStatus.OK).json(car);
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id/manufacturer')
  async getCarManufacturer(@Param() params: CarPayloadParams) {
    const { id } = params;
    return this.carsService.findManufacturer(id);
  }

  @Delete('/:id')
  async deleteCar(@Res() res: Response, @Param() params: CarPayloadParams) {
    try {
      const { id } = params;
      await this.carsService.removeCar(id);
      return res.status(HttpStatus.OK).json({
        message: 'Car removed',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('/:id')
  async updateCar(
    @Res() res: Response,
    @Param() params: CarPayloadParams,
    @Body() carData: CarDto,
  ) {
    try {
      const { id } = params;
      await this.carsService.updateCar(id, carData);
      res.status(HttpStatus.OK).json({
        message: 'Car successfully updated',
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async createCar(@Res() res: Response, @Body() carData: CarDto) {
    try {
      const car = await this.carsService.create(carData);
      return res.status(HttpStatus.OK).json({
        message: 'Car successfully created',
        id: car.id,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
