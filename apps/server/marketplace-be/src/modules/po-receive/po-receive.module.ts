import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinIOModule } from 'megp-shared-be';
import {
  AcceptanceItem,
  AcceptanceNote,
  AcceptanceReceive,
  ReceivingAttachment,
  ReceivingItem,
  ReceivingNote,
} from 'src/entities';

import { UtilityModule } from 'src/utils/utils.module';
import { ReceivingNoteController } from './controllers/receiving-note.controller';
import { ReceivingNoteService } from './services/receiving-note.service';
import { ReceivingItemService } from './services/receiving-item.service';
import { ReceivingAttachmentService } from './services/receiving-attachment.service';
import { ReceivingAttachmentController } from './controllers/receiving-attachment.controller';
import { ReceivingItemController } from './controllers/receiving-item.controller';
import { AcceptanceItemController } from './controllers/acceptance-item.controller';
import { AcceptanceItemService } from './services/acceptance-item.service';
import { AcceptanceNoteController } from './controllers/acceptance-note.controller';
import { AcceptanceNoteService } from './services/acceptance-note.service';
import { AcceptanceReceiveController } from './controllers/acceptance-receive.controller';
import { AcceptanceReceiveService } from './services/acceptance-receive.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReceivingNote,
      ReceivingItem,
      ReceivingAttachment,
      AcceptanceNote,
      AcceptanceItem,
      AcceptanceReceive,
    ]),
    MinIOModule,
    UtilityModule,
  ],
  controllers: [
    ReceivingNoteController,
    ReceivingItemController,
    ReceivingAttachmentController,
    AcceptanceNoteController,
    AcceptanceItemController,
    AcceptanceReceiveController,
  ],
  providers: [
    ReceivingNoteService,
    ReceivingItemService,
    ReceivingAttachmentService,
    AcceptanceNoteService,
    AcceptanceItemService,
    AcceptanceReceiveService,
  ],
  exports: [],
})
export class POReceiveModule {}
