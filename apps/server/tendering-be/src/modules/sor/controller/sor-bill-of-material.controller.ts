import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SorBillOfMaterialService } from '../service/sor-bill-of-material.service';
import { SorBillOfMaterial } from 'src/entities/sor-bill-of-material.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  BulkCreateBillOfMaterialDto,
  CreateSorBillOfMaterialDto,
  UpdateSorBillOfMaterialDto,
} from '../dto/sor-bill-of-material.dto';
import { ExtraCrudController } from 'src/shared/controller';
import { AllowAnonymous } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorBillOfMaterialDto,
  updateDto: UpdateSorBillOfMaterialDto,
};

@ApiBearerAuth()
@Controller('sor-bill-of-materials')
@ApiTags('Sor Bill Of Material Controller')
@AllowAnonymous()
export class SorBillOfMaterialController extends ExtraCrudController<SorBillOfMaterial>(
  options,
) {
  constructor(
    private readonly sorBillOfMaterialService: SorBillOfMaterialService,
  ) {
    super(sorBillOfMaterialService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() itemData: BulkCreateBillOfMaterialDto,
    @Req() req?: any,
  ) {
    return this.sorBillOfMaterialService.bulkCreate(itemData, req);
  }
}
