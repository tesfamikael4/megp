import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
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
}
