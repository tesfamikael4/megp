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
import { CreateUnitDto, UpdateUnitDto } from '../dto/unit.dto';
import { UnitService } from '../services/unit.service';
import { Unit } from '../entities/unit.entity';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { CreateUserUnitDto } from '../dto/employee-unit.dto';

@ApiBearerAuth()
@Controller('units')
@ApiTags('units')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post('create')
  async create(@Body() createUnitDto: CreateUnitDto) {
    return await this.unitService.create(createUnitDto);
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
    return await this.unitService.findOne(id, includes, withDeleted);
  }

  @Get('get-all')
  @ApiPaginatedResponse(Unit)
  @ApiOkResponse({ type: Unit, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.unitService.findAll(query);
  }

  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    return await this.unitService.update(id, updateUnitDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.unitService.remove(id);
  }
  @Patch('activation/:id')
  async activation(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.unitService.activation(id);
  }
  @Post('assign-users/:id')
  async assignUsers(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() userUnitResponseDto: CreateUserUnitDto[],
  ) {
    return await this.unitService.assignUsers(id, userUnitResponseDto);
  }
}
