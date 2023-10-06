import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Approval } from '../entities/approval.entity';
import { ApprovalService } from '../services/approval.service';
import { DataResponseFormat } from 'src/shared/api-data';
import { CollectionQuery } from 'src/shared/collection-query';
import { EntityCrudController } from 'src/shared/controller/entity-crud.controller';

@Controller('approvals')
@ApiTags('Approval')
export class ApprovalController extends EntityCrudController<Approval> {
  constructor(private readonly approvalService: ApprovalService) {
    super(approvalService);
  }

  @Get('findByType')
  async findByType(
    @Param('type') type: string,
    @Query() query: CollectionQuery,
  ): Promise<DataResponseFormat<Approval>> {
    return this.approvalService.findByType(type, query);
  }
}
