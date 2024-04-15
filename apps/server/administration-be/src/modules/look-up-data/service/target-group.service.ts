import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TargetGroup } from 'src/entities/target-group.entity';
import { EntityCrudService } from 'src/shared/service';
import { ILike, Repository } from 'typeorm';
import { CreateTargetGroupDto } from '../dto/target-group.dto';
@Injectable()
export class TargetGroupService extends EntityCrudService<TargetGroup> {
  constructor(
    @InjectRepository(TargetGroup)
    private readonly targetGroupRepository: Repository<TargetGroup>,
  ) {
    super(targetGroupRepository);
  }

  async createUniqueTargetGroup(tGDto: CreateTargetGroupDto): Promise<any> {
    const tGroupExists = await this.targetGroupRepository.exists({
      where: {
        name: tGDto.name,
      },
    });
    if (tGroupExists) {
      throw new ConflictException({
        name: tGDto.name,
        message: 'Target Group already exist.',
      });
    } else {
      const newTGroup = await super.create(tGDto);
      return newTGroup;
    }
  }
}
