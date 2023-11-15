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
  Res,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from '@api-data';
import { CollectionQuery } from '@collection-query';

import { VendorRegistrationsService } from '../services/vendor-registration.service';
import { CreateVendorsDto, SetVendorStatus } from '../dto/vendor.dto';
import { Response } from 'express';
import { VendorInitiationDto } from '../dto/vendor-initiation.dto';
import { CreateAreasOfBusinessInterest } from '../dto/areas-of-business-interest';

import {
  AllowAnonymous,
  CurrentUser,
  JwtGuard,
} from 'src/shared/authorization';
import { WorkflowInstanceService } from 'src/modules/handling/services/workflow-instance.service';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { InsertAllDataDto } from '../dto/save-all.dto';
import { IsrVendorsEntity, VendorsEntity } from 'src/entities';
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('vendor-registrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  userInfo: any;
  constructor(private readonly regService: VendorRegistrationsService) {
    this.userInfo = {
      userId: 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0',
      name: 'muktar joseph',
    };
  }
  @Get('get-vendors')
  async getVendors() {
    return await this.regService.getVendors();
  }
  @Get('get-vendor-status-byId/:vendorId')
  async getVendorStatusById(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorStatusByVendorId(userInfo.id);
  }

  @Post('add-vendor-area-of-interest-To-vendor')
  async addVendorAreaOfInterestByVendorId(
    @Body() createAreasOfBusinessInterest: CreateAreasOfBusinessInterest[],
    @CurrentUser() userInfo: any,
  ) {
    createAreasOfBusinessInterest[0].userId =
      'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.addVendorAreaOfInterestByVendorId(userInfo.id);
  }
  @Get('get-vendor-by-userId')
  async getVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getVendorByUserId(userInfo.id);
  }
  @Get('get-isr-vendor-by-userId')
  async getIsrVendorByuserId(@CurrentUser() userInfo: any) {
    return await this.regService.getIsrVendorByUserId(userInfo.id);
  }
  @Post('add-vendor-information')
  async addVendorInformation(
    @Body() data: InsertAllDataDto,
    @CurrentUser() userInfo: any,
  ) {
    data.data.initial.userId = userInfo.id;
    const result = await this.regService.addVendorInformations(
      data.data,
      userInfo,
    );
    if (!result) throw new BadRequestException(`vendor registration failed`);
    return result;
  }
  @Post('vendor-initiation')
  async VendorInitiation(
    @Body() vendorInitiationDto: VendorInitiationDto,
    @CurrentUser() user: any,
  ) {
    vendorInitiationDto.status = 'Draft';
    vendorInitiationDto.level = 'basic';
    return await this.regService.VendorInitiation(vendorInitiationDto, user);
  }

  @Post('set-application-status')
  async setVendorStatus(@Body() vendorStatusDto: SetVendorStatus) {
    return await this.regService.setVendorStatus(vendorStatusDto);
  }
  @Post('set-isr-vendor-status')
  async setIsrVendorStatus(@CurrentUser() userInfo: any) {
    return await this.regService.setIsrVendorStatus(userInfo);
  }
  @Get('get-application-by-status/:status')
  async getVendorByStatus(@Param('status') status: string) {
    return await this.regService.getVendorByStatus(status);
  }
  @Post('update-vendor')
  async updateVendor(@Body() vendor: any) {
    vendor.userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.setVendorStatus(vendor);
  }
  @Post('delete-vendor-info/:vendorId')
  async changeVendorUserId(@Param('vendorId') vendorId: string) {
    return await this.regService.deleteVendorById(vendorId);
  }
}
