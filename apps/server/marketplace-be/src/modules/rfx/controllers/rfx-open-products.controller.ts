import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';

import { RfxOpenProductService } from '../services/rfx-open-products.service';
import { RfxOpenProduct } from 'src/entities/rfx-open-products.entity';
import {
  CreateRfxOpenProductDto,
  UpdateRfxOpenProductDto,
} from '../dtos/rfx-open-products.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateRfxOpenProductDto,
  updateDto: UpdateRfxOpenProductDto,
};

@ApiBearerAuth()
@Controller('rfx-open-products')
@ApiTags('Rfx Open Products Controller')
export class RfxOpenProductController extends ExtraCrudController<RfxOpenProduct>(
  options,
) {
  constructor(private readonly rfxOpenProductsService: RfxOpenProductService) {
    super(rfxOpenProductsService);
  }
}
