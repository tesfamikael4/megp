import { Module } from '@nestjs/common';
import { DocumentMergerService } from './document-merger.service';
import { MinIOModule } from '../min-io/min-io.module';
import { ConvertDocxToPdsService } from './convert-docx-to-pds.service';

@Module({
  imports: [MinIOModule],
  controllers: [],
  providers: [DocumentMergerService, ConvertDocxToPdsService],
  exports: [DocumentMergerService],
})
export class DocumentMergerModule {}
