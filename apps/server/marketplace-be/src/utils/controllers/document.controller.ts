import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  EntityCrudController,
  EntityCrudOptions,
} from 'megp-shared-be';
import { Document } from 'src/entities/';
import { DocumentService } from '../services/document.service';

const options: EntityCrudOptions = {};

@Controller('documents')
@ApiTags('Documents')
export class DocumentController extends EntityCrudController<Document>(
  options,
) {
  constructor(private readonly documentService: DocumentService) {
    super(documentService);
  }

  @Post()
  @ApiBody({})
  async create(@Body() itemData: any, @CurrentUser() user): Promise<any> {
    return await this.documentService.create(itemData, user);
  }

  @Get('download/:id')
  async download(@Param('id') id: string) {
    return await this.documentService.generatePresignedGetUrl(id);
  }

  @Get('getPresignedUrlWithDoc/:id')
  async getPresignedUrlWithDoc(@Param('id') id: string) {
    return await this.documentService.getPresignedUrlWithDoc(id);
  }

  @Get('getDocumentByItemId/:id')
  async getDocumentByItemId(@Param('id') id: string) {
    return await this.documentService.getDocumentByItemId(id);
  }
  @Get('getAllDocumentsByItemId/:id')
  async getAllDocumentsByItemId(@Param('id') id: string) {
    return await this.documentService.getAllDocumentsByItemId(id);
  }
}
