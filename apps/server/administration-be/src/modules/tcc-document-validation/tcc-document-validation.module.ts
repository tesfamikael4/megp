import { Logger, Module } from '@nestjs/common';
import { TccDocumentValidationService } from './services/tcc-document-validation.service';
import { TccDocumentValidationController } from './controllers/tcc-document-validation.controller';
import { CommonHttpModule } from '@common-http';

@Module({
  imports: [CommonHttpModule],
  controllers: [TccDocumentValidationController],
  providers: [TccDocumentValidationService, Logger],
  exports: [TccDocumentValidationService],
})
export class TccDocumentValidationModule {}
