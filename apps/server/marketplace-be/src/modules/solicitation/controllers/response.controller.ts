import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  CurrentUser,
  AllowAnonymous,
} from 'megp-shared-be';
import { SolResponse } from 'src/entities';
import { SolResponseService } from '../services/response.service';
import {
  CreateSolResponseDto,
  UpdateSolResponseDto,
} from '../dtos/response.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateSolResponseDto,
  updateDto: UpdateSolResponseDto,
};

@ApiBearerAuth()
@Controller('sol-responses')
@ApiTags('Sol Response')
export class SolResponseController extends ExtraCrudController<SolResponse>(
  options,
) {
  constructor(private readonly rfxRepsonseItemService: SolResponseService) {
    super(rfxRepsonseItemService);
  }

  @Get('responses/:rfxId/:vendorId')
  @AllowAnonymous()
  async reviewResonses(
    @Param('rfxId') rfxId: string,
    @Param('vendorId') vendorId: string,
  ) {
    return this.rfxRepsonseItemService.reviewResonses(rfxId, vendorId);
  }
}
