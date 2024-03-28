import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from '../services/organization.service';
import { Organization } from '@entities';
import { EntityCrudController } from 'src/shared/controller';
import {
  CreateOrganizationDto,
  UpdateAddressOrLogoDto,
  UpdateOrganizationDto,
  VendorRegistrationCompletedEvent,
} from '../dto/organization.dto';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EventPattern, Payload } from '@nestjs/microservices';

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

  @EventPattern('vendor-registration-completed')
  async vendorRegistrationCompleted(
    @Payload() payload: VendorRegistrationCompletedEvent,
  ): Promise<any> {
    return this.organizationService.vendorRegistrationCompleted(payload);
  }

  @Post('transaction-test')
  @ApiBody({ type: CreateOrganizationDto })
  async transactionTest(@Body() itemData: CreateOrganizationDto): Promise<any> {
    return this.organizationService.transactionTest(itemData);
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

  @Patch('activate/:id')
  async activate(@Param('id') id: string) {
    return await this.organizationService.activate(id);
  }
}
