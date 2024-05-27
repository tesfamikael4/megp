import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Activity } from 'src/entities/activity.entity';
import { ExtraCrudService } from 'megp-shared-be';

@Injectable()
export class ActivityService extends ExtraCrudService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repositoryActivity: Repository<Activity>,
  ) {
    super(repositoryActivity);
  }
  async create(itemData: any, req?: any): Promise<any> {
    if (req?.user?.organization) {
      itemData.organizationId = req.user.organization.id;
    }
    itemData.name = itemData.title.split(' ').join('');
    const item = this.repositoryActivity.create(itemData);
    await this.repositoryActivity.insert(item);
    return item;
  }
}
