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
@ApiBearerAuth()
@Controller('application-execution')
@ApiTags('Application Excution')
@ApiExtraModels(DataResponseFormat)
export class ApplicationExcutionController {
  userInfo: any;
  constructor(
    private readonly executeService: ApplicationExcutionService,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
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

  /*
    @UseGuards(JwtGuard)
    @Get('notify-complation')
    async notifyComplation(@Req() request: Request, @CurrentUser() user: any) {
      const authToken = request.headers['authorization'].split(' ')[1];
      user['authToken'] = authToken;   
      const url =
        'https://dev-bo.megp.peragosystems.com/vendors/api/business-area"';
      const wfi = new UpdateWorkflowInstanceDto();
      const sample = {
        vendorId: '4e5c1009-fedb-43ab-ae32-bc0f23503686',
        bpId: '96d95fdb-7852-4ddc-982f-0e94d23d15d3',
        serviceId: '5f764d17-a165-42ab-879d-358bc03fe5d8',
        action: WorkflowInstanceEnum.Completed,
      };
      return await this.workflowService.notifyCompletion(wfi, url, user);
    }*/
  /*
  @UseGuards(JwtGuard)
  @Post('notify')

  async notify(@Body() test: TestDto, @CurrentUser() user: any, @Req() request: any) {
    const wfi = new WorkflowInstanceEntity()
    wfi.id = test.wfi.id;
    wfi.serviceId = test.wfi.serviceId;
    wfi.requestorId = test.wfi.requestorId;
    const authToken = request.headers['authorization'].split(' ')[1];
    console.log(wfi)
    user['token'] = authToken;
    await this.workflowService.notify(wfi, test.metaData.url, test.metaData, user)
  }
  */
  @UseGuards(JwtGuard)
  @Post('intiate-workflow')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async testWF(@Body() wfi: CreateWorkflowInstanceDto, @CurrentUser() user, @Req() request: Request,) {
    const authToken = request.headers['authorization'].split(' ')[1];
    user['token'] = authToken;

    const bp = await this.bpService.findBpService(wfi.pricingId);
    if (!bp) throw new NotFoundException('BP not found');
    wfi.serviceId = bp.serviceId;
    wfi.bpId = bp.id;
    return await this.workflowService.intiateWorkflowInstance(
      wfi,
      user,
    );
  }

  @UseGuards(JwtGuard)
  @Post('goto-next-step')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async gottoNextStep(
    @Body() nextStatedto: GotoNextStateDto,
    @Req() request: Request,
    @CurrentUser() user: any,
  ) {
    const authToken = request.headers['authorization'].split(' ')[1];
    user['token'] = authToken;
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
    return await this.executeService.getCurruntTaskByService(
      serviceKey,
      query,
      user,
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
  async fetchCurruntTaskDetail(
    @Param('instanceId') instanceId: string,
    @Query() query: CollectionQuery,
  ) {
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
  @Get('generate-certeficate-pdf')
  async generateCerteficatePdf(@Query() params: any, @Req() req, @Res() res) {
    const templateUrl = params.templateUrl;
    const selector = params.selector;
    console.log(templateUrl, selector);
    const pdfBuffer = await this.executeService.generateCerteficatePdf(
      templateUrl,
      selector,
    );
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=ppda-certeficate.pdf',
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    });
    res.status(200).end(pdfBuffer);
  }

  @UseGuards(JwtGuard)
  @Get('get-invoices')
  @ApiPaginatedResponse(InvoiceResponseDto)
  async fetchInvoices(@Query() query: CollectionQuery) {
    return await this.executeService.getInvoices(query);
  }
  @UseGuards(JwtGuard)
  @Get('get-invoice/:id')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getInvoice(@Param('id') id: string) {
    return await this.executeService.getInvoice(id);
  }
  @UseGuards(JwtGuard)
  @Get('get-my-invoice')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getMyInvoice(@CurrentUser() user: any) {
    return await this.executeService.getMyInvoices(user.id);
  }

  @UseGuards(JwtGuard)
  @Get('get-my-business-areas')
  @ApiOkResponse({ type: ActiveVendorsResponse })
  async getMyBusinessAreas(@CurrentUser() user: any) {
    return await this.executeService.getMyBusinessArea(user.id);
  }
}
