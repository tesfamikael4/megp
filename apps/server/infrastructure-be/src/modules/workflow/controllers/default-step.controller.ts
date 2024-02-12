import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'megp-shared-be';
import { ExtraCrudController } from 'megp-shared-be';
import { DefaultStepService } from '../services/default-step.service';
import { DefaultStep } from 'src/entities/default-step.entity';
import { CurrentUser } from 'megp-shared-be';
import { IgnoreTenantInterceptor } from 'megp-shared-be';

const options: ExtraCrudOptions = {
  entityIdName: 'activityId',
};

@Controller('default-steps')
@ApiTags('default-steps')
export class DefaultStepController extends ExtraCrudController<DefaultStep>(
  options,
) {
  constructor(private readonly defaultStepService: DefaultStepService) {
    super(defaultStepService);
  }

  @Post('bulk-create')
  @IgnoreTenantInterceptor()
  async bulkCreate(
    @Body() defaultStep: any,
    @CurrentUser() user: any,
  ): Promise<any> {
    const organizationId = user.organization.id;
    return this.defaultStepService.bulkCreate(defaultStep, organizationId);
  }

  @Get('order-admin/:id')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @IgnoreTenantInterceptor()
  async findAllAdmin(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<any> {
    const organizationId = user.organization.id;
    return this.defaultStepService.orderAdmin(id, organizationId);
  }

  @Get('order/:id')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  @IgnoreTenantInterceptor()
  async findAll(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<any> {
    const organizationId = user.organization.id;
    return this.defaultStepService.order(id, organizationId);
  }
}
