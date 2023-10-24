import {
  Body,
  Controller,
  Post,
  Put,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUnitDto, UpdateUnitDto } from '../dto/unit.dto';
import { UnitService } from '../services/unit.service';
import { Unit } from '../entities/unit.entity';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
@ExtraCrudDecorator({
  entityIdName: 'organizationId',
})
@Controller('unit')
@ApiTags('unit')
export class UnitController extends ExtraCrudController<Unit> {
  constructor(private readonly unitService: UnitService) {
    super(unitService);
  }

  @Post()
  async create(@Body() createUnitDto: CreateUnitDto): Promise<Unit> {
    return await super.create(createUnitDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ): Promise<Unit | undefined> {
    return await super.update(id, updateUnitDto);
  }
}
