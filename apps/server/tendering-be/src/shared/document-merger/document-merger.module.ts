import { Module } from '@nestjs/common';
import { DocumentMergerService } from './document-merger.service';
import { MinIOModule } from '../min-io/min-io.module';

@Module({
  imports: [MinIOModule],
  controllers: [],
  providers: [DocumentMergerService],
  exports: [DocumentMergerService],
})
export class DocumentMergerModule {}
