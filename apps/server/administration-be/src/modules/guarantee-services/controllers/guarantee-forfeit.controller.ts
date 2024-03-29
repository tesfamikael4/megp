import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { GuaranteeForfeit } from 'src/entities/guarantee-forfeit.entity';
import { GuaranteeForfeitService } from '../services/guarantee-forfeit.service';
import {
  CreateGuaranteeForfeitDto,
  UpdateGuaranteeForfeitDto,
} from '../dtos/guarantee-forfeit.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'guaranteeId',
  createDto: CreateGuaranteeForfeitDto,
  updateDto: UpdateGuaranteeForfeitDto,
};
@Controller('guarantee-forfeits')
@ApiTags('guarantee forfeits')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class GuaranteeForfeitController extends ExtraCrudController<GuaranteeForfeit>(
  options,
) {
  constructor(
    private readonly guaranteeForfeitService: GuaranteeForfeitService,
  ) {
    super(guaranteeForfeitService);
  }

  @Get('document/:id')
  async getDocument(@Param('id') id: string) {
    return await this.guaranteeForfeitService.getDocumentsPresignedUrl(id);
  }
}
