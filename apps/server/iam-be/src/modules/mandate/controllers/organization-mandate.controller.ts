import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { OrganizationMandate } from '@entities';
import { OrganizationMandateService } from '../services/organization-mandate.service';
import { RelationCrudOptions } from 'src/shared/types/crud-option.type';

const options: RelationCrudOptions = {
  firstEntityIdName: 'organizationId',
  firstInclude: 'mandate',
  secondEntityIdName: 'mandateId',
  secondInclude: 'organization',
  // assignFirstDto: CreatePermissionDto,
  // assignSecondDto: UpdatePermissionDto
};

@Controller('organization-mandates')
@ApiTags('organization-mandates')
export class OrganizationMandateController extends RelationCrudController<OrganizationMandate>(
  options,
) {
  constructor(
    private readonly organizationMandateService: OrganizationMandateService,
  ) {
    super(organizationMandateService);
  }
}
