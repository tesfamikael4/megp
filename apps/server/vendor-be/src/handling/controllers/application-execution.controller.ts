import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse, DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { TaskHandlerResponse } from '../dtos/task-handler.response';
import { ApplicationExcutionService } from '../services/application-execution.service';
import { WorkflowInstanceResponse } from '../dtos/workflow-instance.response';
import { InvoiceResponseDto } from 'src/vendor-registration/dto/invoice.dto';
import {
  PaymentReceiptDto,
  PaymentReceiptResponseDto,
} from 'src/vendor-registration/dto/payment-receipt.dto';
import {
  CreateTaskHandlerDto,
  UpdateTaskHandlerDto,
} from '../dtos/task-handler.dto';
import { UpdateTaskDto } from 'src/bpm/dtos/task.dto';
import { ActiveVendorsResponse } from '../dtos/active-vendor-response';

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
    return await this.executeRepository.getCurruntTaskByService(
      serviceKey,
      query,
    );
  }

  @Get('get-currunt-taskDetail/:instanceId')
  @ApiOkResponse({ type: WorkflowInstanceResponse })
  async fetchCurruntTaskDetail(
    @Param('instanceId') instanceId: string,
    // @Query() query: CollectionQuery,
  ) {
    return await this.executeRepository.getCurruntTaskDetail(instanceId);
  }

  @Get('generate-invoice/:instanceId')
  @ApiOkResponse({ type: InvoiceResponseDto })
  async generateInvoice(
    @Param('instanceId') instanceId: string,
    // @Query() query: CollectionQuery,
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

  @Post('attach-payment-receipt')
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
  @Get('get-active-vendors')
  @ApiPaginatedResponse(ActiveVendorsResponse)
  async getActiveTendors(@Query() query: CollectionQuery) {
    return await this.executeRepository.activeVendors(query);
  }
  @Post('pick-task')
  async pickTask(dto: UpdateTaskHandlerDto) {
    return await this.executeRepository.pickTask(dto);
  }
  @Post('confirm-task')
  async ConfirmTask(dto: UpdateTaskHandlerDto) {
    return await this.executeRepository.ConfirmTask(dto);
  }
  @Post('approve-task')
  async ApproveTask(dto: UpdateTaskHandlerDto) {
    return await this.executeRepository.ApproveTask(dto);
  }
  @Post('confirm-payment')
  async ConfirmPayment(dto: UpdateTaskHandlerDto) {
    return await this.executeRepository.ConfirmPayment(dto);
  }
  @Post('generate-invoice')
  async generateCerteficate(dto: UpdateTaskHandlerDto) {
    return await this.executeRepository.generateCerteficate(dto);
  }
  @Post('send-email')
  async sendEmailNotification(dto: UpdateTaskHandlerDto) {
    return await this.executeRepository.sendEmailNotification(dto);
  }
  @Post('send-sms')
  async sendSMSNotification(dto: UpdateTaskHandlerDto) {
    return await this.executeRepository.sendSMSNotification(dto);
  }
}
