import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { CurrentUser } from 'src/shared/authorization';
import { DocumentService } from '../services/document.service';
import { Document } from 'src/entities/document.entity';

const options: EntityCrudOptions = {};

@Controller('documents')
@ApiTags('documents')
export class DocumentController extends EntityCrudController<Document>(
  options,
) {
  constructor(private readonly documentService: DocumentService) {
    super(documentService);
  }

  @Post()
  async create(@Body() itemData: any, @CurrentUser() user): Promise<any> {
    return await this.documentService.create(itemData, user.organization);
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    const presignedUrl = await this.documentService.generatePresignedGetUrl(id);
    return presignedUrl;
  }

  @Get('getDocumentByItemId/:id')
  async getDocumentByItemId(@Param('id') id: string) {
    const document = await this.documentService.getDocumentByItemId(id);
    return document;
  }
}
