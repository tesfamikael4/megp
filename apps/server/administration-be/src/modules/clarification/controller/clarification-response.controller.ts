import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreateClarificationResponseDTO,
  UpdateClarificationResponseDTO,
} from '../dto/clarification-response.dto';
import { ClarificationResponseService } from '../service/clarification-response.service';
import { ClarificationResponse } from 'src/entities/clarification-response.entity';
import { CurrentUser } from 'src/shared/authorization';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: EntityCrudOptions = {
  createDto: CreateClarificationResponseDTO,
  updateDto: UpdateClarificationResponseDTO,
};

@Controller('clarification-responses')
@ApiTags('clarification-responses')
export class ClarificationResponseController extends EntityCrudController<ClarificationResponse>(
  options,
) {
  constructor(
    private readonly clarificationResponseService: ClarificationResponseService,
  ) {
    super(clarificationResponseService);
  }

  @Post()
  async create(
    @Body() itemData: CreateClarificationResponseDTO,
    @CurrentUser() user: any,
    @Req() req?: any,
  ): Promise<ClarificationResponse | null> {
    itemData.responderId = user.id;
    return this.clarificationResponseService.create(itemData);
  }

  @Get('document/:id')
  async getDocument(@Param('id') id: string) {
    return await this.clarificationResponseService.getDocumentsPresignedUrl(id);
  }

  @Get('my-responses')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyResponse(@CurrentUser() user: any, @Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return await this.clarificationResponseService.getMyResponses(
      user.id,
      query,
    );
  }
}
