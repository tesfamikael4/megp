import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Step } from 'src/entities/step.entity';
import { StepService } from '../services/step.service';
import { Activity } from 'src/entities/activity.entity';
import { ActivityService } from '../services/activity.service';

const options: ExtraCrudOptions = {
  entityIdName: 'workflowId',
};

@Controller('activities')
@ApiTags('activities')
export class ActivityController extends ExtraCrudController<Activity>(options) {
  constructor(private readonly activityService: ActivityService) {
    super(activityService);
  }
}
