import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';
import { SolRegistrationService } from '../services/registration.service';
import { SolRegistration } from 'src/entities';
import {
  CreateRegistrationDto,
  UpdateRegistrationDto,
} from '../dtos/registration.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRegistrationDto,
  updateDto: UpdateRegistrationDto,
};

@ApiBearerAuth()
@Controller('sol-registration')
@ApiTags('Sol Registration')
export class SolRegistrationController extends ExtraCrudController<SolRegistration>(
  options,
) {
  constructor(private readonly solBookmarkService: SolRegistrationService) {
    super(solBookmarkService);
  }
}
