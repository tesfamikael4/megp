import {
  Body,
  Controller,
  Get,
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
import { UpdateTaskHandlerDto } from '../dtos/task-handler.dto';
import { HandlingCommonService } from '../services/handling-common-services';

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
    private readonly service: HandlingCommonService, //  private readonly wfService: WorkflowInstanceService,
  ) {
    this.userInfo = {
      userId: '078ddca3-ad1c-4028-aa58-7da3ee529fa9',
      name: 'Dereje Hunew',
    };
  }
  @Get('test')
  async testmyApi() {
    const result = await this.service.generateApplicationNumber('PPDA', 'GNR');
    console.log(result);
    return result;
  }

  @Post('pick-task')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async pickTask(@Body() dto: UpdateTaskHandlerDto) {
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
}
