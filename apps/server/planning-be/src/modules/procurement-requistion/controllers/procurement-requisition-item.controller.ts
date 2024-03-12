import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateProcurementRequisitionItemDto,
  UpdateProcurementRequisitionItemDto,
} from '../dto/procurement-requisition-item.dto';
import { ProcurementRequisitionItemService } from '../services/procurement-requisition-item.service';
import { ProcurementRequisitionItem } from 'src/entities';
import { CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionItemDto,
  updateDto: UpdateProcurementRequisitionItemDto,
};

@Controller('procurement-requisition-items')
@ApiTags('procurement-requisition-items')
export class ProcurementRequisitionItemController extends ExtraCrudController<ProcurementRequisitionItem>(
  options,
) {
  constructor(
    private readonly procurementRequisitionItemService: ProcurementRequisitionItemService,
  ) {
    super(procurementRequisitionItemService);
  }
  @Post('bulk-create')
  async bulkCreate(@CurrentUser() user: any, @Body() data: any) {
    return this.procurementRequisitionItemService.bulkCreate(data, user);
  }
}
