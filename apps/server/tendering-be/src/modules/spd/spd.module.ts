import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocxModule } from 'src/shared/docx/docx.module';
import { MinIOModule } from 'src/shared/min-io/min-io.module';
import {
  Spd,
  SpdPreferenceMargin,
  SpdPreliminaryEvaluation,
  SpdProfessionalSetting,
  SpdQualification,
  SpdTechnicalScoring,
  SpdTemplate,
} from 'src/entities';
import {
  SpdService,
  SpdPreferenceMarginService,
  SpdPreliminaryEvaluationService,
  SpdProfessionalSettingService,
  SpdQualificationService,
  SpdTechnicalScoringService,
  SpdTemplateService,
} from './service';
import {
  SpdController,
  SpdPreferenceMarginController,
  SpdPreliminaryEvaluationController,
  SpdProfessionalSettingController,
  SpdQualificationController,
  SpdTechnicalScoringController,
  SpdTemplateController,
} from './controller';
import { FileHelperService } from '../../shared/min-io/file-helper.service';
import { SpdBidFormService } from './service/spd-bid-form.service';
import { SpdBidForm } from 'src/entities/spd-bid-form.entity';
import { SpdBidFormController } from './controller/spd-bid-form.controller';
import { SpdContractForm } from 'src/entities/spd-contract-form.entity';
import { SpdContractFormService } from './service/spd-contract-form.service';
import { SpdContractFormController } from './controller/spd-contract-form.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Spd,
      SpdPreferenceMargin,
      SpdPreliminaryEvaluation,
      SpdProfessionalSetting,
      SpdQualification,
      SpdTechnicalScoring,
      SpdTemplate,
      SpdBidForm,
      SpdContractForm,
    ]),
    DocxModule,
    MinIOModule,
  ],
  providers: [
    SpdService,
    SpdPreferenceMarginService,
    SpdPreliminaryEvaluationService,
    SpdProfessionalSettingService,
    SpdQualificationService,
    SpdTechnicalScoringService,
    SpdTemplateService,
    FileHelperService,
    SpdBidFormService,
    SpdContractFormService,
  ],
  controllers: [
    SpdController,
    SpdPreferenceMarginController,
    SpdPreliminaryEvaluationController,
    SpdProfessionalSettingController,
    SpdQualificationController,
    SpdTechnicalScoringController,
    SpdTemplateController,
    SpdBidFormController,
    SpdContractFormController,
  ],
})
export class SpdModule {}
