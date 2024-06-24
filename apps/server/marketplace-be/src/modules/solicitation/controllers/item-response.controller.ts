import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  CurrentUser,
  JwtGuard,
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
// @UseGuards(JwtGuard, VendorGuard())
export class SolItemResponseController extends ExtraCrudController<SolItemResponse>(
  options,
) {
  constructor(private readonly rfxResponseItemService: SolItemResponseService) {
    super(rfxResponseItemService);
  }

  @Post()
  async create(itemData: any, @CurrentUser() user: any) {
    itemData.vendorId = user.organization.id;
    return await this.rfxResponseItemService.create(itemData, user);
  }
}
