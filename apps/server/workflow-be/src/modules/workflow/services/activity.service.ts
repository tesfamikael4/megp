import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Activity } from 'src/entities/activity.entity';
import { EntityCrudService, ExtraCrudService } from 'src/shared/service';

@Injectable()
export class ActivityService extends EntityCrudService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repositoryActivity: Repository<Activity>,
  ) {
    super(repositoryActivity);
  }
}
