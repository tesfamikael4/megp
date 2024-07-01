import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinIOModule } from 'megp-shared-be';
import { ScheduleModule } from '@nestjs/schedule';
import { AwardItem, AwardNote } from 'src/entities';
import { UtilityModule } from 'src/utils/utils.module';
import { AwardItemController } from './controllers/award-item.controller';
import { AwardNoteController } from './controllers/award-note.controller';
import { AwardItemService } from './services/award-item.service';
import { AwardNoteService } from './services/award-note.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AwardNote, AwardItem]),
    ScheduleModule.forRoot(),
    MinIOModule,
    UtilityModule,
  ],
  controllers: [AwardItemController, AwardNoteController],
  providers: [AwardItemService, AwardNoteService],
  exports: [],
})
export class AwardModule {}
