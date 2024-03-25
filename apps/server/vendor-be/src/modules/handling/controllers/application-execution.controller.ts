import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { ApplicationExcutionService } from '../services/application-execution.service';

import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
  WorkflowInstanceResponse,
} from '../dto/workflow-instance.dto';
import { CurrentUser, JwtGuard } from 'src/shared/authorization';
import { WorkflowService } from 'src/modules/bpm/services/workflow.service';
import { BusinessProcessService } from 'src/modules/bpm/services/business-process.service';
import { UpdateTaskHandlerDto } from 'src/modules/bpm/dto/task-handler.dto';
import { ActivityResponseDto } from 'src/modules/bpm/dto/activities.dto';

import { WorkflowInstanceEntity } from 'src/entities';
import { VendorRegistrationsService } from 'src/modules/vendor-registration/services/vendor-registration.service';
import { VendorInitiationResponseDto } from 'src/modules/vendor-registration/dto/vendor-initiation.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query/query-mapper';

@ApiBearerAuth()
@Controller('application-execution')
@ApiTags('Application Excution')
@ApiExtraModels(DataResponseFormat)
export class ApplicationExcutionController {
  constructor(
    private readonly executeService: ApplicationExcutionService,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    private readonly vendorService: VendorRegistrationsService,
  ) {}
  @UseGuards(JwtGuard)
  @Get('email')
  async email(@Req() request: Request, @CurrentUser() user: any) {
    return await this.workflowService.sendEmail({
      requestorId: '6b31bfed-c359-1d2a-486d-585a3e4d4305',
    });
  }
  @UseGuards(JwtGuard)
  @Post('notify')
  async notify(@Body() test: any, @CurrentUser() user: any) {
    const wfi = new WorkflowInstanceEntity();
    wfi.id = test.wfi.id;
    wfi.serviceId = test.wfi.serviceId;
    wfi.requestorId = test.wfi.requestorId;
    console.log(wfi);
    await this.workflowService.notify(wfi, test.metaData.url, test.metaData);
  }

  @UseGuards(JwtGuard)
  @Post('intiate-workflow')
  //@ApiOkResponse({ type: WorkflowInstanceResponse })
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async testWF(@Body() wfi: CreateWorkflowInstanceDto[], @CurrentUser() user) {
    const intances = [];
    for (let i = 0; i < wfi.length; i++) {
      const bp = await this.bpService.findBpService(wfi[i].pricingId);
      if (!bp) throw new NotFoundException('BP not found');
      wfi[i].serviceId = bp.serviceId;
      wfi[i].bpId = bp.id;
      const result = await this.workflowService.intiateWorkflowInstance(
        wfi[i],
        user,
      );
      intances.push(result);
    }
    return intances;
  }
  @UseGuards(JwtGuard)
  @Post('goto-next-step')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async gottoNextStep(
    @Body() nextStatedto: GotoNextStateDto,
    @CurrentUser() user: any,
  ) {
    const response = await this.workflowService.gotoNextStep(
      nextStatedto,
      user,
    );
    return response;
  }

  @UseGuards(JwtGuard)
  @Post('pick-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async pickTask(@Body() dto: UpdateTaskHandlerDto, @CurrentUser() user: any) {
    return await this.executeService.pickTask(dto, user);
  }
  @UseGuards(JwtGuard)
  @Post('unpick-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async unpickTask(@Body() dto: UpdateTaskHandlerDto) {
    return await this.executeService.unpickTask(dto);
  }
  @UseGuards(JwtGuard)
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  @Get('get-currunt-tasks/:serviceKey')
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async fetchCurruntTasks(
    @Param('serviceKey') serviceKey: string,
    @Query('q') q: string,
    @CurrentUser() user: any,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.executeService.getCurruntTaskByServiceKey(
      serviceKey,
      query,
      user,
    );
  }

  @UseGuards(JwtGuard)
  @Get('get-customer-tasks')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async fetchCustomerTasks(@Query('q') q: string, @CurrentUser() user: any) {
    const query = decodeCollectionQuery(q);
    return await this.workflowService.getCurruntCustomerTask(query, user);
  }

  @UseGuards(JwtGuard)
  @Get('get-currunt-task-detail/:instanceId')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async fetchCurruntTaskDetail(@Param('instanceId') instanceId: string) {
    const result = await this.executeService.getCurruntTaskDetail(instanceId);
    return result;
  }
  @UseGuards(JwtGuard)
  @Get('get-activities-progress/:instanceId')
  @ApiPaginatedResponse(ActivityResponseDto)
  async fetchActivity(@Param('instanceId') instanceId: string) {
    const result = await this.workflowService.getActivities(instanceId);
    return result;
  }
  /*
  fetch approved vendors
  */
  @UseGuards(JwtGuard)
  @Get('get-vendors')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  @ApiOkResponse({ type: VendorInitiationResponseDto })
  async getVendors(@Query('q') q: string, @CurrentUser() user: any) {
    const query = decodeCollectionQuery(q);
    return await this.vendorService.getVendors(user, query);
  }

  @UseGuards(JwtGuard)
  @Get('get-vendor-detail/:vendorId')
  async getApprovedVendorById(@Param('vendorId') vendorId: string) {
    return await this.vendorService.getApprovedVendorById(vendorId);
  }
  @UseGuards(JwtGuard)
  @Get('get-rejected-vendors')
  @ApiQuery({
    name: 'q',
    type: String,
    required: false,
  })
  async getRejectedVendors(@CurrentUser() user: any, @Query('q') q: string) {
    const query = decodeCollectionQuery(q);
    return await this.vendorService.getRejectedVendors(user, query);
  }
  @UseGuards(JwtGuard)
  @Get('get-rejected-vendor-detail/:vendorId')
  async getRejectedVendorById(@Param('vendorId') vendorId: string) {
    return await this.vendorService.getRejectedISRVendorById(vendorId);
  }
}
