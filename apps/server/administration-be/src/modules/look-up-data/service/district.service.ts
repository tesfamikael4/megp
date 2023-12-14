import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/entities/district.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class DistrictService extends ExtraCrudService<District> {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {
    super(districtRepository);
  }
}
