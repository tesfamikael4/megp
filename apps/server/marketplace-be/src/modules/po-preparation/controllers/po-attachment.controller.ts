import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { POAttachment } from 'src/entities';
import { POAttachmentService } from '../services/po-attachment.service';
import {
  CreatePOAttachmentDto,
  UpdatePOAttachmentDto,
} from '../dtos/po-attachment.dto';
const options: ExtraCrudOptions = {
  entityIdName: 'purchaseOrderId',
  createDto: CreatePOAttachmentDto,
  updateDto: UpdatePOAttachmentDto,
};

@ApiBearerAuth()
@Controller('po-attachment')
@ApiTags('POAttachment')
export class POAttachmentController extends ExtraCrudController<POAttachment>(
  options,
) {
  constructor(private readonly poAttachmentService: POAttachmentService) {
    super(poAttachmentService);
  }

  @Post('upload')
  async upload(@CurrentUser() user: any, @Body() fileInfo: any) {
    return await this.poAttachmentService.upload(user, fileInfo);
  }
  @Get('preview/:id')
  async preview(@Param('id') id: string) {
    return await this.poAttachmentService.download(id);
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    return await this.poAttachmentService.generatePresignedGetUrl(id);
  }
}
