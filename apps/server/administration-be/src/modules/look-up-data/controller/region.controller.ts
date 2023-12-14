import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { RegionService } from '../service/region.service';
import { Region } from 'src/entities/region.entity';
import { CreateRegionDto, UpdateRegionDto } from '../dto/region.dto';
const options: EntityCrudOptions = {
  createDto: CreateRegionDto,
  updateDto: UpdateRegionDto,
};
@Controller('regions')
@ApiTags(' region')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class RegionController extends EntityCrudController<Region>(options) {
  constructor(private readonly regionService: RegionService) {
    super(regionService);
  }
}
