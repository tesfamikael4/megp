import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Param,
  Patch,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CreateMandateDto, UpdateMandateDto } from '../dto/mandate.dto';
import { MandateService } from '../services/mandate.service';
import { Mandate } from '../entities/mandate.entity';
import { CollectionQuery } from '@collection-query';
import { GenericCrudController } from 'src/shared/controller/generic-crud.controller';

@Controller('mandate-news')
@ApiTags('mandate-news')
export class MandateController extends GenericCrudController<Mandate> {
  constructor(private readonly mandateService: MandateService) {
    super(mandateService);
  }

  @Get()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<Mandate>> {
    return await super.findAll(query);
  }

  @Post()
  async create(@Body() createMandateDto: CreateMandateDto): Promise<Mandate> {
    return await super.create(createMandateDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateMandateDto: UpdateMandateDto,
  ): Promise<Mandate | undefined> {
    return await super.update(id, updateMandateDto);
  }
}
