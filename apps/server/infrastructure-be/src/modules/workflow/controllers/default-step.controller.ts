import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { DefaultStepService } from '../services/default-step.service';
import { DefaultStep } from 'src/entities/default-step.entity';
import { CurrentUser } from 'src/shared/authorization';
import { IgnoreTenantInterceptor } from 'src/shared/decorators';

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

  @Get('orderAdmin/:id')
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
    return this.defaultStepService.order(id, organizationId);
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
