import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { InvoiceResponseDto } from 'src/modules/vendor-registration/dto/invoice.dto';
import { ApplicationExcutionService } from '../services/application-execution.service';
import { ActiveVendorsResponse } from '../dto/active-vendor-response';
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
import { InvoiceService } from 'src/modules/vendor-registration/services/invoice.service';
import { WorkflowInstanceEntity } from 'src/entities';
@ApiBearerAuth()
@Controller('application-execution')
@ApiTags('Application Excution')
@ApiExtraModels(DataResponseFormat)
export class ApplicationExcutionController {
  constructor(
    private readonly executeService: ApplicationExcutionService,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    private readonly invoiceService: InvoiceService,
  ) { }
  @UseGuards(JwtGuard)
  @Get('email')
  async email(@Req() request: Request, @CurrentUser() user: any) {
    const authToken = request.headers['authorization'].split(' ')[1];
    user['authToken'] = authToken;
    console.log('@CurrentUser()', user);
    return await this.workflowService.sendEmail(
      { requestorId: '6b31bfed-c359-1d2a-486d-585a3e4d4305' },
      authToken,
    );
  }


  @UseGuards(JwtGuard)
  @Post('notify')
  async notify(
    @Body() test: any,
    @CurrentUser() user: any,
  ) {
    const wfi = new WorkflowInstanceEntity();
    wfi.id = test.wfi.id;
    wfi.serviceId = test.wfi.serviceId;
    wfi.requestorId = test.wfi.requestorId;
    console.log(wfi);
    await this.workflowService.notify(
      wfi,
      test.metaData.url,
      test.metaData
    );
  }

  @UseGuards(JwtGuard)
  @Post('intiate-workflow')
  //@ApiOkResponse({ type: WorkflowInstanceResponse })
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async testWF(
    @Body() wfi: CreateWorkflowInstanceDto[],
    @CurrentUser() user
  ) {
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
  @Get('get-currunt-tasks/:serviceKey')
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async fetchCurruntTasks(
    @Param('serviceKey') serviceKey: string,
    @Query() query: CollectionQuery,
    @CurrentUser() user: any,
  ) {
    return await this.executeService.getCurruntTaskByServiceKey(
      serviceKey,
      query,
      user
    );
  }

  @UseGuards(JwtGuard)
  @Get('get-customer-tasks')
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async fetchCustomerTasks(
    @Query() query: CollectionQuery,
    @CurrentUser() user: any,
  ) {
    return await this.workflowService.getCurruntCustomerTask(query, user);
  }

  @UseGuards(JwtGuard)
  @Get('get-currunt-task-detail/:instanceId')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async fetchCurruntTaskDetail(@Param('instanceId') instanceId: string) {
    return await this.executeService.getCurruntTaskDetail(instanceId);
  }
  @UseGuards(JwtGuard)
  @Get('get-activities-progress/:instanceId')
  @ApiPaginatedResponse(ActivityResponseDto)
  async fetchActivity(@Param('instanceId') instanceId: string) {
    const result = await this.workflowService.getActivities(instanceId);
    return result;
  }
  @UseGuards(JwtGuard)
  @Get('get-invoices')
  @ApiPaginatedResponse(InvoiceResponseDto)
  async fetchInvoices(@Query() query: CollectionQuery) {
    return await this.invoiceService.getInvoices(query);
  }
  @UseGuards(JwtGuard)
  @Get('get-invoice/:id')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getInvoice(@Param('id') id: string) {
    return await this.invoiceService.getInvoice(id);
  }
  @UseGuards(JwtGuard)
  @Get('get-my-invoice')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getMyInvoice(@CurrentUser() user: any) {
    return await this.invoiceService.getMyInvoices(user.id);
  }

  @UseGuards(JwtGuard)
  @Get('get-my-business-areas')
  @ApiOkResponse({ type: ActiveVendorsResponse })
  async getMyBusinessAreas(@CurrentUser() user: any) {
    return await this.executeService.getMyBusinessArea(user.id);
  }
}
