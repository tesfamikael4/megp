import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Measurement } from 'src/entities/measurement.entity';
import { EntityCrudService } from 'src/shared/service';
import { ILike, Repository } from 'typeorm';
import { CreateMeasurementDto } from '../dto/measurement.dto';
@Injectable()
export class MeasurementService extends EntityCrudService<Measurement> {
  constructor(
    @InjectRepository(Measurement)
    private readonly measurementRepository: Repository<Measurement>,
  ) {
    super(measurementRepository);
  }
  async createUniqueData(measurementDto: CreateMeasurementDto): Promise<any> {
    const NameExist = await this.measurementRepository.findOne({
      where: [
        {
          name: ILike(`%${measurementDto.name}%`),
        },
      ],
      withDeleted: true,
    });
    if (NameExist) {
      // If the existing measurement is soft-deleted, recover it
      if (NameExist.deletedAt) {
        await this.measurementRepository.recover(NameExist);
        // Update the description (if needed) and return the recovered measurement
        NameExist.description = measurementDto.description;
        await this.measurementRepository.save(NameExist);
        return NameExist;
      } else {
        // If the measurement is not soft-deleted, return a message indicating the name exists
        return {
          name: measurementDto.name,
          message: 'Measurement already exist.',
        };
      }
    } else {
      // If no measurement with the same name exists, create a new one
      const newMeasurement = new Measurement();
      newMeasurement.name = measurementDto.name;
      newMeasurement.description = measurementDto.description;
      try {
        const result = await this.measurementRepository.save(newMeasurement);
        if (result) {
          return result;
        }
      } catch (error) {
        throw error;
      }
    }
  }
}
