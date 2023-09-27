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
import {
  CreateApplicationDto,
  UpdateApplicationDto,
} from '../dto/application.dto';
import { ApplicationService } from '../services/application.service';
import { Application } from '../entities/application.entity';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';

@ApiBearerAuth()
@Controller('applications')
@ApiTags('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post('create')
  async create(@Body() createApplicationDto: CreateApplicationDto) {
    return await this.applicationService.create(createApplicationDto);
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
    return await this.applicationService.findOne(id, includes, withDeleted);
  }

  @Get('get-all')
  @ApiPaginatedResponse(Application)
  @ApiOkResponse({ type: Application, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.applicationService.findAll(query);
  }

  @Patch('update/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return await this.applicationService.update(id, updateApplicationDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return await this.applicationService.remove(id);
  }
}
