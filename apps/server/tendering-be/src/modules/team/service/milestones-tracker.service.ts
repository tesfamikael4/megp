import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'src/shared/service';
import { MilestonesTracker } from 'src/entities/milestones-tracker.entity';

@Injectable()
export class MileStonesTrackerService extends ExtraCrudService<MilestonesTracker> {
  constructor(
    @InjectRepository(MilestonesTracker)
    private readonly milestonesTrackerRepository: Repository<MilestonesTracker>,
  ) {
    super(milestonesTrackerRepository);
  }
}
