import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocxModule } from 'src/shared/docx/docx.module';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import {
  SccContractDeliverable,
  SccGeneralProvision,
  SccGuarantee,
  SccLiability,
  SccPaymentSchedule,
  SccPaymentTerm,
} from 'src/entities';
import {
  SccContractDeliverableService,
  SccGeneralProvisionService,
  SccGuaranteeService,
  SccLiabilityService,
  SccPaymentScheduleService,
  SccPaymentTermService,
} from './service';
import {
  SccContractDeliverableController,
  SccGeneralProvisionController,
  SccGuaranteeController,
  SccLiabilityController,
  SccPaymentScheduleController,
  SccPaymentTermController,
} from './controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SccContractDeliverable,
      SccGeneralProvision,
      SccGuarantee,
      SccLiability,
      SccPaymentSchedule,
      SccPaymentTerm,
    ]),
    DocxModule,
    MinIOModule,
  ],
  providers: [
    SccContractDeliverableService,
    SccGeneralProvisionService,
    SccGuaranteeService,
    SccLiabilityService,
    SccPaymentScheduleService,
    SccPaymentTermService,
  ],
  controllers: [
    SccContractDeliverableController,
    SccGeneralProvisionController,
    SccGuaranteeController,
    SccLiabilityController,
    SccPaymentScheduleController,
    SccPaymentTermController,
  ],
})
export class SccModule {}
