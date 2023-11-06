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
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { InvoiceResponseDto } from 'src/vendor-registration/dto/invoice.dto';
import { ApplicationExcutionService } from '../services/application-execution.service';
import { WorkflowInstanceResponse } from '../dtos/workflow-instance.response';
import { HandlingCommonService } from '../services/handling-common-services';
import { ActiveVendorsResponse } from '../dtos/active-vendor-response';
import { CurrentUser } from 'src/authorization';
import {
  CreateWorkflowInstanceDto,
  GotoNextStateDto,
} from '../dtos/workflow-instance.dto';
import { BusinessProcessService } from 'src/bpm/services/business-process.service';
import { WorkflowService } from 'src/bpm/services/workflow.service';
import { UpdateTaskHandlerDto } from 'src/bpm/dtos/task-handler.dto';

@Controller('ApplicationExecution')
@ApiTags('Application-excution')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class ApplicationExcutionController {
  userInfo: any;
  constructor(
    private readonly executeService: ApplicationExcutionService,
    private readonly workflowService: WorkflowService,
    private readonly bpService: BusinessProcessService,
    private readonly service: HandlingCommonService, //private readonly wfService: WorkflowInstanceService,
  ) {
    this.userInfo = {
      userId: '078ddca3-ad1c-4028-aa58-7da3ee529fa9',
      name: 'Dereje Hunew',
    };
  }
  @Post('intiate-workflow')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async testWF(@Body() wfi: CreateWorkflowInstanceDto) {
    const bp = await this.bpService.findBpService(wfi.pricingId);
    if (!bp) throw new NotFoundException('BP not found');
    wfi.serviceId = bp.serviceId;
    wfi.bpId = bp.id;
    return await this.workflowService.intiateWorkflowInstance(
      wfi,
      this.userInfo,
    );
  }
  @Post('goto-next-step')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async gottoNextStep(@Body() nextStatedto: GotoNextStateDto) {
    const response = await this.workflowService.gotoNextStep(
      nextStatedto,
      this.userInfo,
    );
    return response;
  }

  @Post('pick-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async pickTask(@Body() dto: UpdateTaskHandlerDto, @CurrentUser() user: any) {
    return await this.executeService.pickTask(dto, this.userInfo);
  }
  @Post('unpick-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async unpickTask(@Body() dto: UpdateTaskHandlerDto) {
    return await this.executeService.unpickTask(dto);
  }

  @Get('get-currunt-tasks/:serviceKey')
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async fetchCurruntTasks(
    @Param('serviceKey') serviceKey: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.executeService.getCurruntTaskByService(serviceKey, query);
  }

  @Get('get-currunt-taskDetail/:instanceId')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async fetchCurruntTaskDetail(
    @Param('instanceId') instanceId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.executeService.getCurruntTaskDetail(instanceId);
  }

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

  @Get('get-invoices')
  @ApiPaginatedResponse(InvoiceResponseDto)
  async fetchInvoices(@Query() query: CollectionQuery) {
    return await this.executeService.getInvoices(query);
  }
  @Get('get-invoice/:id')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getInvoice(@Param('id') id: string) {
    return await this.executeService.getInvoice(id);
  }
  @Get('get-my-invoice/:userId')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getMyInvoice(@Param('userId') userId: string) {
    return await this.executeService.getMyInvoices(userId);
  }
  @Get('get-my-business-areas')
  @ApiOkResponse({ type: ActiveVendorsResponse })
  async getMyBusinessAreas() {
    return await this.executeService.getMyBusinessArea(this.userInfo.id);
  }
}
