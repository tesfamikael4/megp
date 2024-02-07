import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdQualification } from 'src/entities';
import { SpdQualificationService } from '../service/spd-qualification.service';
import {
  CreateSpdQualificationsDto,
  UpdateSpdQualificationsDto,
} from '../dto/spd-qualification.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdQualificationsDto,
  updateDto: UpdateSpdQualificationsDto,
};
@ApiBearerAuth()
@Controller('spd-qualifications')
@ApiTags('Spd-Qualification Controller')
export class SpdQualificationController extends EntityCrudController<SpdQualification>(
  options,
) {
  constructor(
    private readonly spdQualificationService: SpdQualificationService,
  ) {
    super(spdQualificationService);
  }
}
