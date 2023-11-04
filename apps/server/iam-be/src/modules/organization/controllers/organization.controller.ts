import {
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from '../services/organization.service';
import { Organization } from '@entities';
import { EntityCrudController } from 'src/shared/controller';
import {
  CreateOrganizationDto,
  UpdateAddressOrLogoDto,
  UpdateOrganizationDto,
} from '../dto/organization.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';

const options: EntityCrudOptions = {
  createDto: CreateOrganizationDto,
  updateDto: UpdateOrganizationDto,
};

@ApiBearerAuth()
@Controller('organizations')
@ApiTags('organizations')
export class OrganizationController extends EntityCrudController<Organization>(
  options,
) {
  constructor(private readonly organizationService: OrganizationService) {
    super(organizationService);
  }

  @Patch('set-address/:id')
  @ApiBody({ type: UpdateAddressOrLogoDto })
  async setAddress(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateDto: any,
  ) {
    console.log(updateDto);
    return await this.organizationService.setAddress(id, updateDto);
  }
}
