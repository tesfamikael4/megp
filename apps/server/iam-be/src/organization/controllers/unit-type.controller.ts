import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { CreateUnitTypeDto, UpdateUnitTypeDto } from '../dto/unit-type.dto';
import { UnitType } from '../entities/unit-type.entity';
import { UnitTypeService } from '../services/unit-type.service';

@ApiBearerAuth()
@Controller('unitTypes')
@ApiTags('unitTypes')
export class UnitTypeController {
  constructor(private readonly unitTypeService: UnitTypeService) {}

  @Post('create')
  async create(@Body() createUnitTypeDto: CreateUnitTypeDto) {
    return await this.unitTypeService.create(createUnitTypeDto);
  }

  @Get('get/:id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Query() includes: string[],
    withDeleted: boolean,
  ) {
    return await this.unitTypeService.findOne(id, includes, withDeleted);
  }

  @Get('get-all')
  @ApiPaginatedResponse(UnitType)
  @ApiOkResponse({ type: UnitType, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.unitTypeService.findAll(query);
  }

  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateUnitTypeDto: UpdateUnitTypeDto,
  ) {
    return await this.unitTypeService.update(id, updateUnitTypeDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.unitTypeService.remove(id);
  }
}
