import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';
import { ProcurementInstitution } from '@entities';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateProcurementInstitutionDto,
  UpdateProcurementInstitutionDto,
} from '../dto/procurement-institution.dto';
import { ProcurementInstitutionService } from '../services/procurement-institution.service';

const options: EntityCrudOptions = {
  createDto: CreateProcurementInstitutionDto,
  updateDto: UpdateProcurementInstitutionDto,
};

@Controller('procurement-institution')
@ApiTags('procurement-institution')
export class ProcurementInstitutionController extends EntityCrudController<ProcurementInstitution>(
  options,
) {
  constructor(
    private readonly procurementInstitutionService: ProcurementInstitutionService,
  ) {
    super(procurementInstitutionService);
  }
}
