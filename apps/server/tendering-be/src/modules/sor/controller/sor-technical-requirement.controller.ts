import { ExtraCrudController } from 'src/shared/controller';
import { SorTechnicalRequirementService } from '../service/sor-technical-requirement.service';
import { SorTechnicalRequirement } from 'src/entities/sor-technical-requirement.entity';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateSorTechnicalRequirementDto,
  UpdateSorTechnicalRequirementDto,
} from '../dto/sor-technical-requirement.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorTechnicalRequirementDto,
  updateDto: UpdateSorTechnicalRequirementDto,
};

@ApiBearerAuth()
@Controller('sor-technical-requirements')
@ApiTags('Sor Technical Requirement Controller')
export class SorTechnicalRequirementController extends ExtraCrudController<SorTechnicalRequirement>(
  options,
) {
  constructor(
    private readonly sorTechnicalRequirementsService: SorTechnicalRequirementService,
  ) {
    super(sorTechnicalRequirementsService);
  }
}
