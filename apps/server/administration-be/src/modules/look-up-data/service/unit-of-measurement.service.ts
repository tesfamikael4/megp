import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnitOfMeasurement } from 'src/entities/uom.entity';
import { ExtraCrudService } from 'src/shared/service';
import { ILike, Repository } from 'typeorm';
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
}
