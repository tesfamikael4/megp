import { Module } from '@nestjs/common';
import { DocumentManipulatorService } from './document-manipulator.service';
import { MinIOModule } from '../min-io/min-io.module';

@Module({
  imports: [MinIOModule],
  controllers: [],
  providers: [DocumentManipulatorService],
  exports: [DocumentManipulatorService],
})
export class DocumentManipulatorModule {}
