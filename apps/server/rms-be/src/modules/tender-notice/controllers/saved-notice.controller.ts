import { Controller } from '@nestjs/common';
import { SavedNotice } from 'src/entities';
import {
  AllowAnonymous,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { SavedNoticeService } from '../services/saved-notice.service';
import { EventPattern } from '@nestjs/microservices';

const options: ExtraCrudOptions = {
  entityIdName: 'noticeId',
};

@Controller('saved-notices')
@ApiTags('Saved Notices')
export class SavedNoticeController extends ExtraCrudController<SavedNotice>(
  options,
) {
  constructor(private readonly noticeRegistrationService: SavedNoticeService) {
    super(noticeRegistrationService);
  }

  @EventPattern('record-registration')
  @AllowAnonymous()
  async listen(payload: any) {
    payload.noticeId = payload.rfxId || payload.tenderId;
    await this.noticeRegistrationService.create(payload);
  }
}
