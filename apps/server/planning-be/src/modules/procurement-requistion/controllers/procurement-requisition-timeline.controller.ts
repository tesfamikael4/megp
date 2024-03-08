import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionTimeline } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateProcurementRequisitionTimelineDto,
  UpdateProcurementRequisitionTimelineDto,
} from '../dto/procurement-requisition-timeline.dto';
import { ProcurementRequisitionTimelineService } from '../services/procurement-requisition-timeline.service';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionTimelineDto,
  updateDto: UpdateProcurementRequisitionTimelineDto,
};

@Controller('procurement-requisition-timelines')
@ApiTags('procurement-requisition-timelines')
export class ProcurementRequisitionTimelineController extends ExtraCrudController<ProcurementRequisitionTimeline>(
  options,
) {
  constructor(
    private readonly procurementRequisitionTimelineService: ProcurementRequisitionTimelineService,
  ) {
    super(procurementRequisitionTimelineService);
  }
  @Post('bulk-create')
  async bulkCreate(@Body() timelines: any, @Req() req: any) {
    return this.procurementRequisitionTimelineService.bulkCreate(
      timelines,
      req,
    );
  }
}
