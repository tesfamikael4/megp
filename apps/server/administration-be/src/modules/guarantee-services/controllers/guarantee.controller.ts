import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { Guarantee, GuaranteeStatusEnum } from 'src/entities/guarantee.entity';
import { GuaranteeService } from '../services/guarantee.service';
import { CreateGuaranteeDto, UpdateGuaranteeDto } from '../dtos/guarantee.dto';
import { CurrentUser } from 'src/shared/authorization';
import { UpdateGuaranteeStatusDto } from '../dtos/update-guarantee-status.dto';
const options: EntityCrudOptions = {
  createDto: CreateGuaranteeDto,
  updateDto: UpdateGuaranteeDto,
};
@Controller('guarantees')
@ApiTags(' guarantees')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class GuaranteeController extends EntityCrudController<Guarantee>(
  options,
) {
  constructor(private readonly guaranteeService: GuaranteeService) {
    super(guaranteeService);
  }

  @Get('document/:id')
  async getDocument(@Param('id') id: string) {
    return await this.guaranteeService.getDocumentsPresignedUrl(id);
  }

  @Post()
  async create(
    @Body() data: any,
    @CurrentUser() user: any,
  ): Promise<Guarantee> {
    data.vendorId = user.organization?.id;
    data.vendorName = user.organization?.name;
    return this.guaranteeService.create(data);
  }

  @Put('update-status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Body() status: UpdateGuaranteeStatusDto,
  ): Promise<Guarantee> {
    return await this.guaranteeService.updateStatus(id, status);
  }
}
