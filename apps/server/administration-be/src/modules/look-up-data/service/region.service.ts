import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Region } from 'src/entities/region.entity';
import { EntityCrudService } from 'src/shared/service';
import { ILike, Repository } from 'typeorm';
import { CreateRegionDto } from '../dto/region.dto';

@Injectable()
export class RegionService extends EntityCrudService<Region> {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {
    super(regionRepository);
  }
  async createUniqueData(regionDto: CreateRegionDto): Promise<any> {
    const NameExist = await this.regionRepository.findOne({
      where: [
        {
          name: ILike(`%${regionDto.name}%`),
        },
      ],
      withDeleted: true,
    });
    if (NameExist) {
      // If the existing region is soft-deleted, recover it
      if (NameExist.deletedAt) {
        await this.regionRepository.recover(NameExist);
        await this.regionRepository.save(NameExist);
        return NameExist;
      } else {
        // If the region is not soft-deleted, return a message indicating the name exists
        return {
          name: regionDto.name,
          message: 'Region already exist.',
        };
      }
    } else {
      // If no region with the same name exists, create a new one
      const newRegion = new Region();
      newRegion.name = regionDto.name;
      try {
        const result = await this.regionRepository.save(newRegion);
        if (result) {
          return result;
        }
      } catch (error) {
        throw error;
      }
    }
  }
}
