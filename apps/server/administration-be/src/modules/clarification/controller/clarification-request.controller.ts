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
import { ClarificationRequest } from 'src/entities/clarification-request.entity';
import { ClarificationRequestService } from '../service/clarification-request.service';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  CreateClarificationRequestDTO,
  UpdateClarificationRequestDTO,
} from '../dto/clarification-request.dto';
import { CurrentUser } from 'src/shared/authorization';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'clarificationResponseId',
  createDto: CreateClarificationRequestDTO,
  updateDto: UpdateClarificationRequestDTO,
};

@Controller('clarification-requests')
@ApiTags('clarification-requests')
export class ClarificationRequestController extends ExtraCrudController<ClarificationRequest>(
  options,
) {
  constructor(
    private readonly clarificationRequestService: ClarificationRequestService,
  ) {
    super(clarificationRequestService);
  }

  @Post()
  async create(
    @Body() itemData: CreateClarificationRequestDTO,
    @CurrentUser() user: any,
    @Req() req?: any,
  ): Promise<ClarificationRequest | null> {
    itemData.requesterId = user.id;
    itemData.requesterEmail = user.email;
    return this.clarificationRequestService.create(itemData);
  }

  @Get('document/:id')
  async getDocument(@Param('id') id: string) {
    return await this.clarificationRequestService.getDocumentsPresignedUrl(id);
  }

  @Get()
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getAllRequests(@Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return await this.clarificationRequestService.getAllRequests(query);
  }

  @Get('my-requests')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyRequests(@CurrentUser() user: any, @Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return await this.clarificationRequestService.getMyRequests(user.id, query);
  }
}
