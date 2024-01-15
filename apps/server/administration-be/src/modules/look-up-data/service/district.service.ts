import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/entities/district.entity';
import { ExtraCrudService } from 'src/shared/service';
import { ILike, Repository } from 'typeorm';
import { CreateDistrictDto } from '../dto/district.dto';

@Injectable()
export class DistrictService extends ExtraCrudService<District> {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {
    super(districtRepository);
  }
  async createUniqueData(districtDto: CreateDistrictDto): Promise<any> {
    const NameExist = await this.districtRepository.findOne({
      where: [
        {
          name: ILike(`%${districtDto.name}`),
        },
      ],
      withDeleted: true,
    });
    if (NameExist) {
      // If the existing  District is soft-deleted, recover it
      if (NameExist.deletedAt) {
        await this.districtRepository.recover(NameExist);
        await this.districtRepository.save(NameExist);
        return NameExist;
      } else {
        // If the District is not soft-deleted, return a message indicating the name exists
        return {
          name: districtDto.name,
          message: 'District already exist.',
        };
      }
    } else {
      // If no measurement with the same name exists, create a new one
      const newTGroup = new District();
      newTGroup.name = districtDto.name;
      try {
        const result = await this.districtRepository.save(newTGroup);
        if (result) {
          return result;
        }
      } catch (error) {
        throw error;
      }
    }
  }
}
