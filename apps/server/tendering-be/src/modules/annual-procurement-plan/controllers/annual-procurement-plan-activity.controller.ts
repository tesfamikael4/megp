import { Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnualProcurementPlanActivity } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateAnnualProcurementPlanActivityDto,
  UpdateAnnualProcurementPlanActivityDto,
} from '../dto/annual-procurement-plan-activity.dto';
import { AnnualProcurementPlanActivityService } from '../services/annual-procurement-plan-activity.service';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { validate } from 'class-validator';
import { ExceptionFilter } from 'src/shared/exceptions/rpc-exception.filter';

const options: ExtraCrudOptions = {
  entityIdName: 'annualProcurementPlanId',
  createDto: CreateAnnualProcurementPlanActivityDto,
  updateDto: UpdateAnnualProcurementPlanActivityDto,
};

@Controller('annual-procurement-plan-activities')
@ApiTags('annual-procurement-plan-activities')
export class AnnualProcurementPlanActivityController extends ExtraCrudController<AnnualProcurementPlanActivity>(
  options,
) {
  constructor(
    private readonly annualProcurementPlanActivityService: AnnualProcurementPlanActivityService,
  ) {
    super(annualProcurementPlanActivityService);
  }
  @UseFilters(ExceptionFilter)
  @EventPattern('postBudget-Approved')
  async handleCreateActivityEvent(
    @Payload() activities: any,
    @Ctx() context: RmqContext,
  ) {
    validate(activities).then(async (errors) => {
      // errors is an array of validation errors
      if (errors.length > 0) {
        // console.log("validation failed. errors: ", errors);
        throw new RpcException(Buffer.from(JSON.stringify(errors), 'utf-8'));
      } else {
        const activity = {
          id: activities.id,
          // annualProcurementPlanId: activities.annualProcurementPlanId,
          postBudgetPlanId: activities.postBudgetPlanId,
          activityName: activities.name,
          procurementReferenceNumber: activities.procurementReference,
          description: activities.description,
          estimatedAmount: activities.estimatedAmount,
          calculatedAmount: activities.calculatedAmount,
          currency: activities.currency,
          status: activities.status,
          isMultipleYear: activities.isMultipleYear,
          remark: activities.remark,
          classification: activities.classification,
          annualProcurementPlanItems: activities.postBudgetPlanItems,
          annualProcurementPlanTimelines: activities.postBudgetPlanTimelines,
          procurementMechanisms: activities.postProcurementMechanisms,
          annualProcurementPlanDisbursements:
            activities.postBudgePlantDisbursements,
          requisitionerAssignments: activities.postBudgetRequisitioners,
        };
        return await super.create(activity);
      }
    });
  }
}
