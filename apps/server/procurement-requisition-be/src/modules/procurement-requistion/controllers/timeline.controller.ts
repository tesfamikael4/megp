import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Timeline } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateTimelineDto, UpdateTimelineDto } from '../dto/timeline.dto';
import { TimelineService } from '../services/timeline.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateTimelineDto,
  updateDto: UpdateTimelineDto,
};

@Controller('timelines')
@ApiTags('timelines')
export class TimelineController extends ExtraCrudController<Timeline>(options) {
  constructor(
    private readonly procurementRequisitionTimelineService: TimelineService,
  ) {
    super(procurementRequisitionTimelineService);
  }
}
