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
  ) {}
  @UseGuards(JwtGuard)
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
  @UseGuards(JwtGuard)
  @Post('goto-next-step')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async gottoNextStep(@Body() nextStatedto: GotoNextStateDto) {
    const response = await this.workflowService.gotoNextStep(
      nextStatedto,
      this.userInfo,
    );
    return response;
  }
  @UseGuards(JwtGuard)
  @Post('pick-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async pickTask(@Body() dto: UpdateTaskHandlerDto, @CurrentUser() user: any) {
    console.log('user--> ', user);
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
  @Get('get-currunt-task-detail/:instanceId')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async fetchCurruntTaskDetail(
    @Param('instanceId') instanceId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.executeService.getCurruntTaskDetail(instanceId);
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
  @Get('get-my-invoice/:userId')
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
