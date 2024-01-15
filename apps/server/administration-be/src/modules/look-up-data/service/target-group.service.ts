import { Injectable } from '@nestjs/common';
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
  async createUniqueData(tGDto: CreateTargetGroupDto): Promise<any> {
    const NameExist = await this.targetGroupRepository.findOne({
      where: [
        {
          name: ILike(`%${tGDto.name}%`),
        },
      ],
      withDeleted: true,
    });
    if (NameExist) {
      // If the existing Target Group is soft-deleted, recover it
      if (NameExist.deletedAt) {
        await this.targetGroupRepository.recover(NameExist);
        // Update the description (if needed) and return the recovered Target Group
        NameExist.description = tGDto.description;
        await this.targetGroupRepository.save(NameExist);
        return NameExist;
      } else {
        return {
          name: tGDto.name,
          message: 'Target Group already exist.',
        };
      }
    } else {
      // If no targetGroup with the same name exists, create a new one
      const newTargetGroup = new TargetGroup();
      newTargetGroup.name = tGDto.name;
      newTargetGroup.description = tGDto.description;
      try {
        const result = await this.targetGroupRepository.save(newTargetGroup);
        if (result) {
          return result;
        }
      } catch (error) {
        throw error;
      }
    }
  }
}
