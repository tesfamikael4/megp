import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateUnitOfMeasurementDto } from '../dto/uom.dto';
import { ItemMaster } from 'src/entities';
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

  async deleteUoM(id: string): Promise<void> {
    try {
      await super.delete(id);
    } catch (error) {
      if (error.code === '23503') {
        const referencedEntity = ItemMaster.name;
        const referencingEntity = UnitOfMeasurement.name;
        throw new Error(
          `Cannot delete or update this ${referencingEntity} as it is referenced by other ${referencedEntity}.`,
        );
      } else {
        throw error;
      }
    }
  }
}
