import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SorBillOfMaterialService } from '../service/sor-bill-of-material.service';
import { SorBillOfMaterial } from 'src/entities/sor-bill-of-material.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateSorBillOfMaterialDto,
  UpdateSorBillOfMaterialDto,
} from '../dto/sor-bill-of-material.dto';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorBillOfMaterialDto,
  updateDto: UpdateSorBillOfMaterialDto,
};

@ApiBearerAuth()
@Controller('sor-bill-of-materials')
@ApiTags('Sor Bill Of Material Controller')
export class SorBillOfMaterialController extends ExtraCrudController<SorBillOfMaterial>(
  options,
) {
  constructor(
    private readonly sorBillOfMaterialService: SorBillOfMaterialService,
  ) {
    super(sorBillOfMaterialService);
  }
}
