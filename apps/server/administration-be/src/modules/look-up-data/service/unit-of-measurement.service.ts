import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateUnitOfMeasurementDto } from '../dto/uom.dto';
@Injectable()
export class UnitOfMeasurementService extends ExtraCrudService<UnitOfMeasurement> {
  constructor(
    @InjectRepository(UnitOfMeasurement)
    private readonly uomRepository: Repository<UnitOfMeasurement>,
  ) {
    super(uomRepository);
  }

  async createUniqueUoM(UoMDto: CreateUnitOfMeasurementDto): Promise<any> {
    const unitOfMeasurementExists = await this.uomRepository.exists({
      where: {
        name: UoMDto.name,
      },
    });
    if (unitOfMeasurementExists) {
      throw new ConflictException({
        name: UoMDto.name,
        message: 'Unit of Measurement Already Exist.',
      });
    } else {
      const newUoM = await super.create(UoMDto);
      return newUoM;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const item = await this.uomRepository.findOneOrFail({ where: { id } });
      await this.uomRepository.remove(item);
    } catch (error) {
      if (error.code === '23503') {
        throw new Error(
          `Unable to delete. This UoM is linked to other items, please delete them first.`,
        );
      } else {
        throw error;
      }
    }
  }
}
