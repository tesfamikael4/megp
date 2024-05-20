import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  CurrentUser,
} from 'megp-shared-be';
import { SolItemResponse } from 'src/entities/sol-item-response.entity';
import { SolItemResponseService } from '../services/item-response.service';
import {
  CreateSolItemResponseDto,
  UpdateSolItemResponseDto,
} from '../dtos/item-response.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateSolItemResponseDto,
  updateDto: UpdateSolItemResponseDto,
};

@ApiBearerAuth()
@Controller('sol-item-responses')
@ApiTags('Sol Response Items')
export class SolItemResponseController extends ExtraCrudController<SolItemResponse>(
  options,
) {
  constructor(private readonly rfxRepsonseItemService: SolItemResponseService) {
    super(rfxRepsonseItemService);
  }

  @Post()
  async create(itemData: CreateSolItemResponseDto, @CurrentUser() user: any) {
    itemData.vendorId = user?.id;
    return await this.rfxRepsonseItemService.create(itemData, user);
  }
}
