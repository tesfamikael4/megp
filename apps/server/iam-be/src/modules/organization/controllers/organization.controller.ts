import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from '../services/organization.service';
import { Organization } from '../entities/organization.entity';
import { EntityCrudController } from 'src/shared/controller';
import { UpdateAddressOrLogoDto } from '../dto/organization.dto';

@ApiBearerAuth()
@Controller('organizations')
@ApiTags('organizations')
export class OrganizationController extends EntityCrudController<Organization>() {
  constructor(private readonly organizationService: OrganizationService) {
    super(organizationService);
  }

  @Post()
  async create(@Body() createOrganizationDto: Organization) {
    return await this.organizationService.create(createOrganizationDto);
  }

  @Patch('set-address/:id')
  async setAddress(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateAddressOrLogoDto: UpdateAddressOrLogoDto,
  ) {
    return await this.organizationService.setAddress(
      id,
      updateAddressOrLogoDto,
    );
  }
}
