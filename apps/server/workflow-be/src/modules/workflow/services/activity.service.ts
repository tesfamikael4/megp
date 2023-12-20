import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from '../../../shared/service';
import { Step } from '../../../entities';
import { Activity } from 'src/entities/activity.entity';

@Injectable()
export class ActivityService extends ExtraCrudService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly repositoryActivity: Repository<Activity>,
  ) {
    super(repositoryActivity);
  }
}
