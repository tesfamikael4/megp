import { Injectable } from '@nestjs/common';
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
  async createUniqueData(UoMDto: CreateUnitOfMeasurementDto): Promise<any> {
    const NameExist = await this.uomRepository.findOne({
      where: [
        { name: ILike(`%${UoMDto.name}%`) },
        {
          abbreviation: ILike(`%${UoMDto.abbreviation}%`),
        },
      ],
      withDeleted: true,
    });

    if (NameExist) {
      if (NameExist.deletedAt) {
        await this.uomRepository.recover(NameExist);
        NameExist.abbreviation = UoMDto.abbreviation;
        NameExist.measurementId = UoMDto.measurementId;
        await this.uomRepository.save(NameExist);
        return NameExist;
      } else {
        // If the Unit of Measurement is not soft-deleted, return a message indicating the name exists
        return {
          name: UoMDto.name,
          abbreviation: UoMDto.abbreviation,
          message: 'Unit of Measurement Already Exist.',
        };
      }
    } else {
      const newUOfMeasurement = new UnitOfMeasurement();
      newUOfMeasurement.name = UoMDto.name;
      newUOfMeasurement.abbreviation = UoMDto.abbreviation;
      newUOfMeasurement.measurementId = UoMDto.measurementId;
      return await this.uomRepository.save(newUOfMeasurement);
    }
  }
}
