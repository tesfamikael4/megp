import { Controller } from '@nestjs/common';
import { TenderNoticeService } from '../services/tender-notice.service';
import { TenderNotice } from 'src/entities';
import { EntityCrudController, EntityCrudOptions } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateTenderNoticeDto,
  UpdateTenderNoticeDto,
} from '../dto/tender-notice.dto';

const options: EntityCrudOptions = {
  createDto: CreateTenderNoticeDto,
  updateDto: UpdateTenderNoticeDto,
};

@Controller('tender-notices')
@ApiTags('Tender Notices')
export class TenderNoticeController extends EntityCrudController<TenderNotice>(
  options,
) {
  constructor(private readonly categoriesService: TenderNoticeService) {
    super(categoriesService);
  }
}
