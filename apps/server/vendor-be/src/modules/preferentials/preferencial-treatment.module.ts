import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { AuthorizationModule } from 'src/shared/authorization';
import { PreferentailTreatmentService } from './services/preferentail-treatment.service';
import { PreferentailTreatmentsController } from './controllers/preferential-treatment.controller';
import { WorkflowService } from '../bpm/services/workflow.service';
import { BpmModule } from '../bpm/bpm.module';
import { VendorRegistrationModule } from '../vendor-registration/vendor-registration.module';
import { ServiceModule } from '../services/service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PreferentialTreatmentsEntity]),
    AuthorizationModule,
    BpmModule,
    VendorRegistrationModule,
    ServiceModule,
  ],
  exports: [PreferentailTreatmentService],
  providers: [PreferentailTreatmentService],
  controllers: [PreferentailTreatmentsController],
})
export class PreferentialTreatmentModule { }
