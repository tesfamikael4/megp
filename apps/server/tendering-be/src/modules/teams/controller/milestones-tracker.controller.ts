import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { MilestonesTracker } from 'src/entities/milestones-tracker.entity';
import { MileStonesTrackerService } from '../service/milestones-tracker.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@Controller('milestones-tracker')
@ApiTags('Milestones Tracker Controller')
export class MilestonesTrackerController extends ExtraCrudController<MilestonesTracker>(
  options,
) {
  constructor(
    private readonly mileStonesTrackerService: MileStonesTrackerService,
  ) {
    super(mileStonesTrackerService);
  }
}
