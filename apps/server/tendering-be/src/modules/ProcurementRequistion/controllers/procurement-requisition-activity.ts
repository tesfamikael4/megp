import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionActivity } from 'src/entities';
import { RelationCrudController } from 'src/shared/controller';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';
import {
  AssignPostBudgetPlanActivityDto,
  AssignProcurementRequisitionDto,
} from '../dto/procurement-requisition-activity.dto';
import { ProcurementRequisitionActivityService } from '../services/procurement-requisition-activity.service copy';

const options: RelationCrudOptions = {
  firstEntityIdName: 'procurementRequisitionId',
  firstInclude: 'postBudgetPlanActivity',
  secondEntityIdName: 'postBudgetPlanActivityId',
  secondInclude: 'procurementRequisition',
  assignFirstDto: AssignPostBudgetPlanActivityDto,
  assignSecondDto: AssignProcurementRequisitionDto,
};

@Controller('procurement-requisition-activities')
@ApiTags('procurement-requisition-activities')
export class ProcurementRequisitionActivityController extends RelationCrudController<ProcurementRequisitionActivity>(
  options,
) {
  constructor(
    private readonly procurementRequisitionActivityService: ProcurementRequisitionActivityService,
  ) {
    super(procurementRequisitionActivityService);
  }
}
