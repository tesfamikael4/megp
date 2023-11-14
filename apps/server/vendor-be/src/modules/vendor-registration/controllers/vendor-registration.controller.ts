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

import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import { WorkflowInstanceService } from 'src/modules/handling/services/workflow-instance.service';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from 'src/modules/handling/dto/workflow-instance.dto';
import { InsertAllDataDto } from '../dto/save-all.dto';
@ApiBearerAuth()
@Controller('vendor-registrations')
@ApiTags('Vendor-registrations')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class VendorRegistrationsController {
  userInfo: any;
  constructor(
    private readonly regService: VendorRegistrationsService,
    private readonly workflowInstanceService: WorkflowInstanceService,
    private readonly bpService: BusinessProcessService,
  ) {
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
  async getVendorStatusById(@Param('vendorId') vendorId: string) {
    vendorId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorStatusByVendorId(vendorId);
  }

  @Get('get-vendor-by-vendorId/:vendorId')
  async getVendorByVendorId(@Param('vendorId') vendorId: string) {
    vendorId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorId(vendorId);
  }

  @Post('add-vendor-area-of-interest-To-vendor')
  async addVendorAreaOfInterestByVendorId(
    @Body() createAreasOfBusinessInterest: CreateAreasOfBusinessInterest[],
  ) {
    createAreasOfBusinessInterest[0].userId =
      'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.addVendorAreaOfInterestByVendorId(
      createAreasOfBusinessInterest,
    );
  }
  @Get('get-vendor-by-userId/:userId')
  async getVendorByuserId(@Param('userId') userId: string) {
    userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.getVendorByUserId(userId);
  }
  @UseGuards(JwtGuard)
  @Post('add-vendor-information')
  async addVendorInformation(
    @Body() data: InsertAllDataDto,
    @CurrentUser() user: any,
  ) {
    data.data.initial.userId = user.id;
    const result = await this.regService.addVendorInformations(data.data);
    if (!result) throw new BadRequestException(`vendor registration failed`);
    if (
      data.data.initial.status == 'Submit' &&
      data.data.initial.level == 'Submit'
    ) {
      const wfi = new CreateWorkflowInstanceDto();
      try {
        const instances = [];
        const response = [];
        const interests = data.data.areasOfBusinessInterest;
        for (let i = 0; i < interests.length; i++) {
          const bp = await this.bpService.findBpService(
            interests[i].priceRange,
          );
          if (!bp) {
            throw new NotFoundException('Business Process Not Found');
          }
          wfi.bpId = bp.id;
          wfi.serviceId = bp.serviceId;
          wfi.requestorId = result.id;
          const workflowInstance =
            await this.workflowInstanceService.create(wfi);
          instances.push(workflowInstance);
          response.push({
            applicationNumber: workflowInstance.application.applicationNumber,
            instanceNumber: workflowInstance.application.id,
            vendorId: '7ab5738b-12b4-6721-5705-6ad796599b51',
          });
        }

        for (const instance of instances) {
          const dto = new GotoNextStateDto();
          dto.action = 'ISR';
          dto.instanceId = instance.application.id;
          const result = await this.workflowInstanceService.gotoNextStep(
            dto,
            this.userInfo,
          );
        }
        return response;
      } catch (error) {
        throw new BadRequestException(`workflow service failed`);
      }
    }

    return { msg: 'Success' };
  }
  @UseGuards(JwtGuard)
  @Post('vendor-initiation')
  async VendorInitiation(
    @Body() vendorInitiationDto: VendorInitiationDto,
    @CurrentUser() user: any,
  ) {
    vendorInitiationDto.userId = user.id;
    vendorInitiationDto.status = 'Draft';
    vendorInitiationDto.level = 'basic';
    return await this.regService.VendorInitiation(vendorInitiationDto);
  }
  @Post('set-application-status')
  async setVendorStatus(@Body() vendorStatus: SetVendorStatus) {
    vendorStatus.userId = 'b23f0b00-0a59-4f6d-9fd9-34d6fa960e0';
    return await this.regService.setVendorStatus(vendorStatus);
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
