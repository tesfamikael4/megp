import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from 'src/entities/measurement.entity';
import { EntityCrudService } from 'src/shared/service';
import { EntityNotFoundError, Repository } from 'typeorm';
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

  async getMeasurementWithUoms(id: string): Promise<Measurement> {
    try {
      return await this.measurementRepository.findOneOrFail({
        where: { id },
        relations: {
          uoms: true,
        },
      });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Measurement not found');
      }
      throw error;
    }
  }
}
