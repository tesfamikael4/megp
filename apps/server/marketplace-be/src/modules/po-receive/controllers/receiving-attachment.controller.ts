import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { ReceivingAttachment } from 'src/entities';
import { ReceivingAttachmentService } from '../services/receiving-attachment.service';
import {
  CreateReceivingAttachmentDto,
  UpdateReceivingAttachmentDto,
} from '../dtos/receiving-attachment.dto';
const options: ExtraCrudOptions = {
  entityIdName: 'receivingNoteId',
  createDto: CreateReceivingAttachmentDto,
  updateDto: UpdateReceivingAttachmentDto,
};

@ApiBearerAuth()
@Controller('receiving-attachments')
@ApiTags('ReceivingAttachment')
export class ReceivingAttachmentController extends ExtraCrudController<ReceivingAttachment>(
  options,
) {
  constructor(
    private readonly receivingAttachmentService: ReceivingAttachmentService,
  ) {
    super(receivingAttachmentService);
  }

  @Post('upload')
  async upload(@CurrentUser() user: any, @Body() fileInfo: any) {
    return await this.receivingAttachmentService.upload(user, fileInfo);
  }
  @Get('preview/:id')
  async preview(@Param('id') id: string) {
    return await this.receivingAttachmentService.download(id);
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    return await this.receivingAttachmentService.generatePresignedGetUrl(id);
  }
}
