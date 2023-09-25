import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { TaskHandlerResponse } from './workflow-instances/task-handler.response';
import { TaskTrackerResponse } from './workflow-instances/task-tracker.response';
import { ApplicationExcutionService } from './application-execution.service';
import { WorkflowInstanceResponse } from './workflow-instances/workflow-instance.response';
import { InvoiceResponseDto } from 'src/vendor-registration/dto/invoice.dto';
import {
  PaymentReceiptDto,
  PaymentReceiptResponseDto,
} from 'src/vendor-registration/dto/payment-receipt.dto';

@Controller('ApplicationExecution')
@ApiTags('Application-excution')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiResponse({ status: 400, description: 'Bad Request' })
@ApiExtraModels(DataResponseFormat)
export class ApplicationExcutionController {
  constructor(private readonly executeRepository: ApplicationExcutionService) {}

  @Get('get-currunt-tasks/:serviceKey')
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async fetchCurruntTasks(
    @Param('serviceKey') serviceKey: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.executeRepository.getCurruntTaskByService(serviceKey);
  }

  @Get('generate-invoice/:instanceId')
  @ApiPaginatedResponse(WorkflowInstanceResponse)
  async generateInvoice(
    @Param('instanceId') instanceId: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.executeRepository.generateInvoice(instanceId, instanceId);
  }
  @Get('get-invoices')
  @ApiPaginatedResponse(InvoiceResponseDto)
  async fetchInvoices(@Query() query: CollectionQuery) {
    return await this.executeRepository.getInvoices(query);
  }
  @Get('get-invoice/:id')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async getInvoice(@Param('id') id: string) {
    return await this.executeRepository.getInvoice(id);
  }

  @Post('create-payment')
  @ApiOkResponse({ type: PaymentReceiptResponseDto })
  async savePayment(
    @Body() command: PaymentReceiptDto,
    //   @UploadedFile() attachment: Express.Multer.File
  ) {
    // command.createdBy = user.id;
    /*
            if (attachment) {
              const result = await this.fileManagerService.uploadFile(
                attachment,
                FileManagerHelper.UPLOADED_FILES_DESTINATION
              );
              console.log(attachment);
              if (result) {
                command.attachmentUrl = attachment.path;
                command.type = attachment.mimetype;
                command.filename = attachment.filename;
              }
            */
    return await this.executeRepository.savePayment(command);
  }
  ///////////////////////////////////
  @Get('get-currunt-tasks')
  @ApiPaginatedResponse(TaskHandlerResponse)
  async getCurruntTasks(
    @Param('servicekey') servicekey: string,
    @Query() query: CollectionQuery,
  ) {
    return await this.executeRepository.getCurrunTasks(servicekey, query);
  }
  /*
    @Get('get-completed-tasks/:instanceId')
    @ApiOkResponse({ type: TaskTrackerResponse })
    async getCompletedTasks(@Param('instanceId') instanceId: string) {
      return await this.executeRepository.getCompletedTasks(instanceId);
    }*/
}
