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
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from '../dto/application.dto';
import { ApplicationService } from '../services/application.service';
import { Application } from '../entities/application.entity';
import { CollectionQuery } from '@collection-query';
import { GenericCrudController } from 'src/shared/controller/generic-crud.controller';

@Controller('application-news')
@ApiTags('application-news')
export class ApplicationNewController extends GenericCrudController<Application> {
  constructor(private readonly applicationService: ApplicationService) {
    super(applicationService);
  }

  @Get()
  async findAll(
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<Application>> {
    return await super.findAll(query);
  }

  @Post()
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    return await super.create(createApplicationDto);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ): Promise<Application | undefined> {
    return await super.update(id, updateApplicationDto);
  }
}
