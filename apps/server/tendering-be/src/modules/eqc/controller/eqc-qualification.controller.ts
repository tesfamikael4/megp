import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EqcQualification } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { EqcQualificationService } from '../service/eqc-qualification.service';
import { ChangeQualificationCategoryDto } from '../dto';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('eqc-qualifications')
@ApiTags('Eqc Qualifications Controller')
export class EqcQualificationController extends ExtraCrudController<EqcQualification>(
  options,
) {
  constructor(
    private readonly eqcQualificationService: EqcQualificationService,
  ) {
    super(eqcQualificationService);
  }

  @Post('change-category')
  async changeStatus(@Body() itemData: ChangeQualificationCategoryDto) {
    return this.eqcQualificationService.changeCategory(itemData);
  }
}
