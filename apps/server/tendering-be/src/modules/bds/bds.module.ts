import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BdsAward,
  BdsEvaluation,
  BdsGeneral,
  BdsPreparation,
  BdsSubmission,
} from 'src/entities';
import { BdsAwardController } from './controller/award.controller';
import { BdsEvaluationController } from './controller/evaluation.controller';
import { BdsGeneralController } from './controller/general.controller';
import { BdsPreparationController } from './controller/preparation.controller';
import { BdsSubmissionController } from './controller/submission.controller';
import { BdsAwardService } from './service/awards.service';
import { BdsEvaluationService } from './service/evaluation.service';
import { BdsGeneralService } from './service/general.service';
import { BdsPreparationService } from './service/preparation.service';
import { BdsSubmissionService } from './service/submission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BdsAward,
      BdsEvaluation,
      BdsGeneral,
      BdsPreparation,
      BdsSubmission,
    ]),
  ],
  controllers: [
    BdsAwardController,
    BdsEvaluationController,
    BdsGeneralController,
    BdsPreparationController,
    BdsSubmissionController,
  ],
  providers: [
    BdsAwardService,
    BdsEvaluationService,
    BdsGeneralService,
    BdsPreparationService,
    BdsSubmissionService,
  ],
})
export class BdsModule {}
