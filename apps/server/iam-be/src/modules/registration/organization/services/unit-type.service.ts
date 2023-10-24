import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UnitType } from '../entities/unit-type.entity';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class UnitTypeService extends ExtraCrudService<UnitType> {
  constructor(
    @InjectRepository(UnitType)
    private readonly groupRepository: Repository<UnitType>,
  ) {
    super(groupRepository);
  }
}
