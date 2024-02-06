import { Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnualProcurementPlanService } from '../services/annual-procurement-plan.service';
import {
  CreateAnnualProcurementPlanDto,
  UpdateAnnualProcurementPlanDto,
} from '../dto/annual-procurement-Plan.dto';
import { AnnualProcurementPlan } from 'src/entities';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import {
  EventPattern,
  Payload,
  Ctx,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { validate } from 'class-validator';
import { ExceptionFilter } from 'src/shared/exceptions/rpc-exception.filter';
import { AllowAnonymous } from 'src/shared/authorization';

const options: EntityCrudOptions = {
  createDto: CreateAnnualProcurementPlanDto,
  updateDto: UpdateAnnualProcurementPlanDto,
};

@Controller('annual-procurement-plans')
@ApiTags('annual-procurement-plans')
export class AnnualProcurementPlanController extends EntityCrudController<AnnualProcurementPlan>(
  options,
) {
  constructor(
    private readonly procurementRequisitionService: AnnualProcurementPlanService,
  ) {
    super(procurementRequisitionService);
  }
  @AllowAnonymous()
  @EventPattern('to-pr')
  @UseFilters(ExceptionFilter)
  async handleCreateActivityEvent(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    validate(payload).then(async (errors) => {
      // errors is an array of validation errors
      if (errors.length > 0) {
        // console.log("validation failed. errors: ", errors);
        throw new RpcException(Buffer.from(JSON.stringify(errors), 'utf-8'));
      } else {
        return await this.procurementRequisitionService.createViaEvent(
          payload.postBudgetPlan[0],
        );
      }
    });
  }
}
