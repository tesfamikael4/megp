import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { ItemAttachment } from 'src/entities';
import { ItemAttachmentService } from '../services/item-attachment.service';
import {
  CreateItemAttachmentDto,
  UpdateItemAttachmentDto,
} from '../dtos/item-attachment.dto';
const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateItemAttachmentDto,
  updateDto: UpdateItemAttachmentDto,
};

@ApiBearerAuth()
@Controller('item-attachments')
@ApiTags('ItemAttachment')
export class ItemAttachmentController extends ExtraCrudController<ItemAttachment>(
  options,
) {
  constructor(private readonly itemAttachmentService: ItemAttachmentService) {
    super(itemAttachmentService);
  }

  @Post('upload')
  async upload(@CurrentUser() user: any, @Body() fileInfo: any) {
    return await this.itemAttachmentService.upload(user, fileInfo);
  }
  @Get('preview/:id')
  async preview(@Param('id') id: string) {
    return await this.itemAttachmentService.download(id);
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    return await this.itemAttachmentService.generatePresignedGetUrl(id);
  }
}
