import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaxonomyCodeSet } from 'src/entities/taxonomy-code-set.entity';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateTaxonomyCodeSetDto } from '../dtos/create-taxonomy.dto';
import { TaxonomyCodeSetService } from '../services/taxonomy-code_set.service';

const options: EntityCrudOptions = {
  createDto: CreateTaxonomyCodeSetDto,
};

@Controller('taxonomies')
@ApiTags('Taxonomies')
export class TaxonomyCodeSetController extends EntityCrudController<TaxonomyCodeSet>(
  options,
) {
  constructor(private readonly taxonomyCodeSetService: TaxonomyCodeSetService) {
    super(taxonomyCodeSetService);
  }

  @Post()
  create(@Body() createTaxonomyCodeSetDto: CreateTaxonomyCodeSetDto) {
    return this.taxonomyCodeSetService.create(createTaxonomyCodeSetDto);
  }
}
