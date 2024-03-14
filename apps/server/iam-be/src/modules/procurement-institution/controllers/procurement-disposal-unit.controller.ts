import { ProcurementDisposalUnit } from '@entities';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ProcurementDisposalUnitService } from '../services/procurement-disposal-unit.service';
import {
  CreateProcurementDisposalUnitDto,
  UpdateProcurementDisposalUnitDto,
} from '../dto/procurement-disposal-unit.dto';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementInstitutionId',
  createDto: CreateProcurementDisposalUnitDto,
  updateDto: UpdateProcurementDisposalUnitDto,
};

@Controller('procurementDisposalUnits')
@ApiTags('procurementDisposalUnits')
export class ProcurementDisposalUnitController extends ExtraCrudController<ProcurementDisposalUnit>(
  options,
) {
  constructor(
    private readonly procurementDisposalUnitService: ProcurementDisposalUnitService,
  ) {
    super(procurementDisposalUnitService);
  }
}
