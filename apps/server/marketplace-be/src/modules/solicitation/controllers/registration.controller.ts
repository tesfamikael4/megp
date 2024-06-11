import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  decodeCollectionQuery,
  CurrentUser,
  JwtGuard,
} from 'megp-shared-be';
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
@Controller('sol-registrations')
@ApiTags('Sol Registration')
// @UseGuards(JwtGuard, VendorGuard())
export class SolRegistrationController extends ExtraCrudController<SolRegistration>(
  options,
) {
  constructor(private readonly solRegistrationService: SolRegistrationService) {
    super(solRegistrationService);
  }

  @Get('solicitation-status')
  @ApiOperation({
    summary: 'Back-Office Solicitation Status Checks',
  })
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async solicitationStatus(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.solRegistrationService.solicitationStatus(query);
  }
}
