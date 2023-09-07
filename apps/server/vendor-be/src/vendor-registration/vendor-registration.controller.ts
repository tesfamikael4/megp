import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Param,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';
import {
  RegistrationStatus,
  RegistrationTypes,
} from 'src/shared/enums/vendor-enums';

import { VendorRegistrationsService } from './vendor-registration.service';
import { ServicesResponseDto } from './dto/services.dto';
import {
  ApplicationResponseDto,
  CreateApplicationDto,
  UpdateApplicationDto,
} from './dto/application.dto';
//@ApiBearerAuth()
@Controller('VendorRegistrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  constructor(private readonly regService: VendorRegistrationsService) {}
  @Post('submit-application')
  async create(@Body() regDto: CreateApplicationDto) {
    return await this.regService.create(regDto);
  }
  @Post('draft-application')
  async draft(@Body() dto: CreateApplicationDto) {
    return await this.regService.create(dto);
  }

  @Get('get-application/:id')
  async findOne(@Param('id') id: string) {
    return await this.regService.findOne(id);
  }

  @Get('get-applications')
  @ApiPaginatedResponse(ApplicationResponseDto)
  // @ApiOkResponse({ type: Todo, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.regService.findAll(query);
  }

  @Patch('update-application/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() dto: UpdateApplicationDto,
  ) {
    return await this.regService.update(id, dto);
  }

  @Delete('delete-application/:id')
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    return await this.regService.remove(id);
  }

  @Get('get-registration-types')
  async getRegistrationTypes() {
    const array = Object.entries(RegistrationTypes).map((entry) => {
      const [key, value] = entry;
      return {
        key,
        value,
      };
    });
    return array;
  }

  //child methods
  @Get('get-services')
  @ApiPaginatedResponse(ServicesResponseDto)
  // @ApiOkResponse({ type: Todo, isArray: false })
  async findServices(@Query() query: CollectionQuery) {
    return await this.regService.findServices(query);
  }
}
