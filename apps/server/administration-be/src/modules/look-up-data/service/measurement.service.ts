import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from 'src/entities/measurement.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateMeasurementDto } from '../dto/measurement.dto';
@Injectable()
export class MeasurementService extends EntityCrudService<Measurement> {
  constructor(
    @InjectRepository(Measurement)
    private readonly measurementRepository: Repository<Measurement>,
  ) {
    super(measurementRepository);
  }

  async createUniqueMeasurement(
    measurementDto: CreateMeasurementDto,
  ): Promise<any> {
    const measurementExists = await this.measurementRepository.exists({
      where: {
        name: measurementDto.name,
      },
    });
    if (measurementExists) {
      throw new ConflictException({
        name: measurementDto.name,
        message: 'This Measurement already exist',
      });
    } else {
      const newMeasurement = await super.create(measurementDto);
      return newMeasurement;
    }
  }
}
