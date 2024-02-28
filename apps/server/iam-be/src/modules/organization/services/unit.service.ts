import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Unit } from '@entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class UnitService extends ExtraCrudService<Unit> {
  constructor(
    @InjectRepository(Unit)
    private readonly repositoryUnit: Repository<Unit>,
  ) {
    super(repositoryUnit);
  }

  async findRootUnit(organizationId: string): Promise<Unit | undefined> {
    return await this.repositoryUnit.findOne({
      where: {
        organizationId,
        parentId: IsNull(),
      },
    });
  }

  async softDelete(id: string, req?: any): Promise<void> {
    const item = await this.repositoryUnit.findOne({
      where: {
        id,
      },
      relations: {
        userUnits: true,
      },
      select: {
        id: true,
      },
    });

    if (!item) throw new NotFoundException(`not_found`);

    if (item.userUnits.length > 0) {
      throw new BadRequestException(`cant_delete_unit_with_users`);
    }
    await this.repositoryUnit.softRemove(item);
  }
}
