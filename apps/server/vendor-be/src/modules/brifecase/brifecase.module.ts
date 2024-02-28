import { Module } from '@nestjs/common';
import { BrifecaseController } from './controllers/brifecase.controller';
import { BrifecasesService } from './services/brifecase.service';
import { FileService } from '../vendor-registration/services/file.service';

@Module({
  controllers: [BrifecaseController],
  imports: [FileService],
  providers: [BrifecasesService],
})
export class BrifecaseModule {}
