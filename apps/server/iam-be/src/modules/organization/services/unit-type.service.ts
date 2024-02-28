import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UnitType } from '@entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class UnitTypeService extends ExtraCrudService<UnitType> {
  constructor(
    @InjectRepository(UnitType)
    private readonly groupRepository: Repository<UnitType>,
  ) {
    super(groupRepository);
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.groupRepository.findOne({
      where: {
        id,
      },
      relations: {
        units: true,
      },
      select: {
        id: true,
      },
    });

    if (!item) throw new NotFoundException(`not_found`);

    if (item.units.length > 0) {
      throw new BadRequestException(`cant_delete_unit_type_with_units`);
    }
    await this.groupRepository.softRemove(item);
  }
}
