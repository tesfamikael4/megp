import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DataResponseFormat } from 'src/shared/api-data';
import { District } from 'src/entities/district.entity';
import { DistrictService } from '../service/district.service';
import { CreateDistrictDto, UpdateDistrictDto } from '../dto/district.dto';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
const options: ExtraCrudOptions = {
  entityIdName: 'regionId',
  createDto: CreateDistrictDto,
  updateDto: UpdateDistrictDto,
};
@Controller('districts')
@ApiTags(' district')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class DistrictController extends ExtraCrudController<District>(options) {
  constructor(private readonly districtService: DistrictService) {
    super(districtService);
  }
  @Post()
  async createUniqueData(@Body() districtDto: CreateDistrictDto) {
    return await this.districtService.createUniqueData(districtDto);
  }
}
