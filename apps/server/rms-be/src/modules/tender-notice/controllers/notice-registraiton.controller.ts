import { Controller } from '@nestjs/common';
import { NoticeRegistration } from 'src/entities';
import {
  AllowAnonymous,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { NoticeRegistrationService } from '../services/notice-registration.service';
import { EventPattern } from '@nestjs/microservices';

const options: ExtraCrudOptions = {
  entityIdName: 'noticeId',
};

@Controller('notice-registrations')
@ApiTags('Notice Registrations')
export class NoticeRegistrationController extends ExtraCrudController<NoticeRegistration>(
  options,
) {
  constructor(
    private readonly noticeRegistrationService: NoticeRegistrationService,
  ) {
    super(noticeRegistrationService);
  }

  @EventPattern('record-registration')
  @AllowAnonymous()
  async listen(payload: any) {
    payload.noticeId = payload.rfxId || payload.tenderId;
    await this.noticeRegistrationService.create(payload);
  }
}
