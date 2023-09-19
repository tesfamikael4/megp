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
import { BusinessAreas } from 'src/shared/enums/vendor-enums';

import { VendorBasicsService } from './vendor-basics.service';
import {
  CreateVendorsDto,
  UpdateVendorsDto,
  VendorsResponseDto,
} from './dto/vendor.dto';
import { CreateShareholdersDto } from './dto/shareholder.dto';
//@ApiBearerAuth()
@Controller('VendorBasics')
@ApiTags('Vendor-profile')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorBasicsController {
  constructor(private readonly service: VendorBasicsService) { }
  @Post('create-profile')
  async create(@Body() regDto: CreateVendorsDto) {
    console.log('dto', regDto);
    return await this.service.create(regDto);
  }

  @Get('get-vendor/:id')
  async findOne(@Param('id') id: string) {
    return await this.service.findOne(id);
  }

  @Get('get-vendors')
  @ApiPaginatedResponse(VendorsResponseDto)
  // @ApiOkResponse({ type: Todo, isArray: false })
  async findAll(@Query() query: CollectionQuery) {
    return await this.service.findAll(query);
  }

  @Patch('update-vendor/:id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
    @Body() dto: UpdateVendorsDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Delete('delete-vendor/:id')
  @ApiOkResponse()
  async remove(
    @Param(
      'id',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: string,
  ) {
    await this.service.remove(id);
    return 'success';
  }

  @Get('get-business-areas')
  async getRegistrationTypes() {
    const array = Object.entries(BusinessAreas).map((entry) => {
      const [key, value] = entry;
      return {
        key,
        value,
      };
    });
    return array;
  }

  @Get('get-ShareHolders-by-vendorId/vinderId')
  async getShareHoldersByVendorId(@Param("vinderId") vinderId: string) {
    console.log('dto', vinderId);
    return await this.service.getShareHoldersByVendorId(vinderId);
  }
  @Get('get-ShareHolders')
  async getShareHolders() {
    return await this.service.getShareHolders();
  }
  @Get('get-ShareHolder-by-id/:shareholderId')
  async getShareHolderById(@Param("shareholderId") shareholderId: string) {
    return await this.service.getShareHolderById(shareholderId);
  }
  @Post('create-ShareHolder')
  async createShareHolderById(@Body() createShareholder: CreateShareholdersDto) {
    return await this.service.createShareHolderById(createShareholder);
  }
  // Bank Crud 
  @Post('add-bank-information-to-vendor/:vendorId')
  async addBankInformationToVendor(@Body() createShareholder: CreateShareholdersDto) {
    return await this.service.createShareHolderById(createShareholder);
  }
}
