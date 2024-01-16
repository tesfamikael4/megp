import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'src/shared/types/crud-option.type';
import {
  EntityCrudController,
  ExtraCrudController,
} from 'src/shared/controller';
import { Step } from 'src/entities/step.entity';
import { StepService } from '../services/step.service';
import { Activity } from 'src/entities/activity.entity';
import { ActivityService } from '../services/activity.service';

const options: EntityCrudOptions = {};

@Controller('activities')
@ApiTags('activities')
export class ActivityController extends EntityCrudController<Activity>(
  options,
) {
  constructor(private readonly activityService: ActivityService) {
    super(activityService);
  }
}
