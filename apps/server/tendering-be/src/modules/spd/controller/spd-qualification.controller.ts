import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdQualification } from 'src/entities';
import { CreateSpdQualificationDto, UpdateSpdQualificationDto } from '../dto';
import { SpdQualificationService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdQualificationDto,
  updateDto: UpdateSpdQualificationDto,
};

@ApiBearerAuth()
@Controller('spd-qualifications')
@ApiTags('Spd Qualifications')
export class SpdQualificationController extends ExtraCrudController<SpdQualification>(
  options,
) {
  constructor(
    private readonly spdQualificationService: SpdQualificationService,
  ) {
    super(spdQualificationService);
  }
}
