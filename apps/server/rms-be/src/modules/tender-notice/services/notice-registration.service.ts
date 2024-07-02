import { Injectable } from '@nestjs/common';
import { NoticeRegistration, TenderNotice } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtraCrudService } from 'megp-shared-be';

@Injectable()
export class NoticeRegistrationService extends ExtraCrudService<NoticeRegistration> {
  constructor(
    @InjectRepository(NoticeRegistration)
    private readonly noticeRegistrationRepository: Repository<NoticeRegistration>,
  ) {
    super(noticeRegistrationRepository);
  }
}
