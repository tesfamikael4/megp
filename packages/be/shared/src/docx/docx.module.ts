import { DocxService } from './docx.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [DocxService],
  exports: [DocxService],
})
export class DocxModule {}
