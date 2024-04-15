import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { CreateRegionDto } from '../dto/region.dto';

@Injectable()
export class RegionService extends EntityCrudService<Region> {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {
    super(regionRepository);
  }

  async createUniqueDistrict(regionDto: CreateRegionDto): Promise<any> {
    const regionExists = await this.regionRepository.exists({
      where: {
        name: regionDto.name,
      },
    });
    if (regionExists) {
      throw new ConflictException({
        name: regionDto.name,
        message: 'This Region already exist',
      });
    } else {
      const newRegion = await super.create(regionDto);
      return newRegion;
    }
  }
}
