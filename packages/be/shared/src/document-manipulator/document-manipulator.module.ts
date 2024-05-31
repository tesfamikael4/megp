import { Module } from '@nestjs/common';
import { DocumentManipulatorService } from './document-manipulator.service';
import { MinIOModule } from '../min-io/min-io.module';
import { FileHelperService } from './file-helper.service';

@Module({
  imports: [MinIOModule],
  controllers: [],
  providers: [DocumentManipulatorService, FileHelperService],
  exports: [DocumentManipulatorService, FileHelperService],
})
export class DocumentManipulatorModule {}
