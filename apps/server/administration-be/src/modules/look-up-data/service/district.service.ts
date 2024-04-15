import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/entities/district.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateDistrictDto } from '../dto/district.dto';

@Injectable()
export class DistrictService extends ExtraCrudService<District> {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {
    super(districtRepository);
  }

  async createUniqueDistrict(districtDto: CreateDistrictDto): Promise<any> {
    const districtExists = await this.districtRepository.exists({
      where: {
        name: districtDto.name,
      },
    });
    if (districtExists) {
      throw new ConflictException({
        name: districtDto.name,
        message: 'This District already exist',
      });
    } else {
      const newDistrict = await super.create(districtDto);
      return newDistrict;
    }
  }
}
