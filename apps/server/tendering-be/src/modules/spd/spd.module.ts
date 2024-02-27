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
  ],
  controllers: [
    SpdController,
    SpdPreferenceMarginController,
    SpdPreliminaryEvaluationController,
    SpdProfessionalSettingController,
    SpdQualificationController,
    SpdTechnicalScoringController,
    SpdTemplateController,
  ],
})
export class SpdModule {}
