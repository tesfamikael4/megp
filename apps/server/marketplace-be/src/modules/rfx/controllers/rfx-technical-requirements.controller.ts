import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { RfxTechnicalRequirementService } from '../services/rfx-technical-requirement.service';
import { RfxTechnicalRequirement } from 'src/entities';
import {
  CreateRfxTechnicalRequirementDto,
  UpdateRfxTechnicalRequirementDto,
} from '../dtos/rfx-technical-requirement.dto';

const option = {
  entityIdName: 'rfxItemId',
  createDto: CreateRfxTechnicalRequirementDto,
  updateDto: UpdateRfxTechnicalRequirementDto,
};

@Controller('rfx-technical-requirements')
@ApiTags('Rfx Technical Requirements')
export class RfxTechnicalRequirementController extends ExtraCrudController<RfxTechnicalRequirement>(
  option,
) {
  constructor(
    private readonly rfxTechnicalRequirementService: RfxTechnicalRequirementService,
  ) {
    super(rfxTechnicalRequirementService);
  }
}
