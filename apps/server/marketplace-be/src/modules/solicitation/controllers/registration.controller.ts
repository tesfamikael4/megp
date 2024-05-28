import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  decodeCollectionQuery,
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
@Controller('sol-registration')
@ApiTags('Sol Registration')
export class SolRegistrationController extends ExtraCrudController<SolRegistration>(
  options,
) {
  constructor(private readonly solRegistrationService: SolRegistrationService) {
    super(solRegistrationService);
  }

  @Get('vendors-list/:rfxId')
  async getVendorsList(@Param('rfxId') rfxId: string, @Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.solRegistrationService.vendorsList(rfxId, query);
  }

  @Get('solicitation-status')
  async solicitationStatus(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.solRegistrationService.solicitationStatus(query);
  }
}
