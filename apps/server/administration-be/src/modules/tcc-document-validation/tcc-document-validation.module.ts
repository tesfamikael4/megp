import { Logger, Module } from '@nestjs/common';
import { TccDocumentValidationService } from './services/tcc-document-validation.service';
import { TccDocumentValidationController } from './controllers/tcc-document-validation.controller';

@Module({
  imports: [],
  controllers: [TccDocumentValidationController],
  providers: [TccDocumentValidationService, Logger],
  exports: [TccDocumentValidationService],
})
export class TccDocumentValidationModule {}
