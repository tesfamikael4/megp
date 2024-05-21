import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { CreateTaxDto, UpdateTaxDto } from '../dto/tax.dto';
import { TaxService } from '../service/tax.service';
import { Tax } from 'src/entities';

const options: EntityCrudOptions = {
  createDto: CreateTaxDto,
  updateDto: UpdateTaxDto,
};

@Controller('taxs')
@ApiTags('Taxs')
export class TaxController extends EntityCrudController<Tax>(options) {
  constructor(private readonly taskService: TaxService) {
    super(taskService);
  }
  @Post()
  async createUniqueTax(@Body() data: CreateTaxDto) {
    return await this.taskService.createUniqueTax(data);
  }
}
