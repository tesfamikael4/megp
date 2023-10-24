import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RelationCrudController } from 'src/shared/controller/relation-crud.controller';
import { OrganizationMandate } from '../entities/organization-mandate.entity';
import { OrganizationMandateService } from '../services/organization-mandate.service';
import { RelationCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@RelationCrudDecorator({
  firstEntityIdName: 'organizationId',
  firstInclude: 'mandate',
  secondEntityIdName: 'mandateId',
  secondInclude: 'organization',
})
@Controller('organization-mandates')
@ApiTags('organization-mandates')
export class OrganizationMandateController extends RelationCrudController<OrganizationMandate>() {
  constructor(
    private readonly organizationMandateService: OrganizationMandateService,
  ) {
    super(organizationMandateService);
  }
}
