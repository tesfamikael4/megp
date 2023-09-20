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
import { InsertAllDataDto } from './dto/save-all.dto';
import { VendorsBankDto } from './dto/bank-vendor.dto';
//@ApiBearerAuth()
@Controller('VendorRegistrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  constructor(private readonly regService: VendorRegistrationsService) { }
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
  @Get('get-vendors')
  async getVendors() {
    return await this.regService.getVendors();
  }
  @Get('get-vendor-by-vendorId/:vendorId')
  async getVendorByVendorId(@Param("vendorId") vendorId: string) {
    return await this.regService.getVendorId(vendorId);
  }
  @Get('get-vendor-by-userId/:userId')
  async getVendorByuserId(@Param("userId") userId: string) {
    return await this.regService.getVendorByUserId(userId);
  }

  @Post('vendor-save-all')
  async vendorSaveAll(@Body() data: InsertAllDataDto) {
    console.log('dto', data.data.data.basicRegistration);
    return await this.regService.registerVendor(data);
  }
  //  bank information
  @Post('add-bank-to-vendor/:vendorId')
  async addBankToVendor(@Body() data: VendorsBankDto, @Param("vendorId") vendorId: string) {
    // console.log('dto', data.data.data.basicRegistration);
    // return await this.regService.addBankToVendor(data);
  }
  @Post('add-vendor-information')
  async addVendorInformation(@Body() data: InsertAllDataDto) {
    // console.log('dto', data.data.data.basicRegistration);
    return await this.regService.addVendorInformations(data);
  }
  @Post('upload-attachment/:filePath/:fileType/:vendorId')
  async uploadAttachment(@Param("filePath") filePath: string, @Param("vendorId") vendorId: string, @Param("fileType") fileType: string) {
    // console.log('dto', data.data.data.basicRegistration);
    return await this.regService.upload_MRA_TPINAttachment(filePath.trim(), fileType.trim(), vendorId.trim());
  }
}
