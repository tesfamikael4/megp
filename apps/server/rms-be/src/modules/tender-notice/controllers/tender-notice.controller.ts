import { Controller, Get, Query, Req } from '@nestjs/common';
import { TenderNoticeService } from '../services/tender-notice.service';
import { TenderNotice } from 'src/entities';
import {
  AllowAnonymous,
  DataResponseFormat,
  EntityCrudController,
  EntityCrudOptions,
  IgnoreTenantInterceptor,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreateTenderNoticeDto,
  UpdateTenderNoticeDto,
} from '../dto/tender-notice.dto';
import { NoticeBookmarkService } from '../services/notice-bookmark.service';
import { NoticeRegistrationService } from '../services/notice-registration.service';
import { EventPattern } from '@nestjs/microservices';

const options: EntityCrudOptions = {
  createDto: CreateTenderNoticeDto,
  updateDto: UpdateTenderNoticeDto,
};

@Controller('tender-notices')
@ApiTags('Tender Notices')
export class TenderNoticeController extends EntityCrudController<TenderNotice>(
  options,
) {
  constructor(
    private readonly noticeService: TenderNoticeService,
    private readonly bookmarkService: NoticeBookmarkService,
    private readonly registrationService: NoticeRegistrationService,
  ) {
    super(noticeService);
  }

  @EventPattern('record-notice')
  @AllowAnonymous()
  async listen(payload: any) {
    return await this.noticeService.create(payload);
  }

  @Get()
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @IgnoreTenantInterceptor()
  async findAll(
    @Query('q') q?: string,
    @Req() req?: any,
  ): Promise<DataResponseFormat<TenderNotice>> {
    const query = decodeCollectionQuery(q);
    return this.service.findAll(query);
  }
}
