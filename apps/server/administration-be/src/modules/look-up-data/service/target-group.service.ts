import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TargetGroup } from 'src/entities/target-group.entity';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
@Injectable()
export class TargetGroupService extends EntityCrudService<TargetGroup> {
  constructor(
    @InjectRepository(TargetGroup)
    private readonly targetGroupRepository: Repository<TargetGroup>,
  ) {
    super(targetGroupRepository);
  }
}
