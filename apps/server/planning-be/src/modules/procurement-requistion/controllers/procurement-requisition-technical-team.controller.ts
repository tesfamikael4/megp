import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcurementRequisitionTechnicalTeam } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateProcurementRequisitionTechnicalTeamDto,
  CreateProcurementRequisitionTechnicalTeamsDto,
  UpdateProcurementRequisitionTechnicalTeamDto,
} from '../dto/procurement-requisition-technical-team.dto';
import { ProcurementRequisitionTechnicalTeamService } from '../services/procurement-requisition-technical-team.service';
import { CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'procurementRequisitionId',
  createDto: CreateProcurementRequisitionTechnicalTeamDto,
  updateDto: UpdateProcurementRequisitionTechnicalTeamDto,
};

@Controller('Procurement-requisition-technical-teams')
@ApiTags('Procurement-requisition-technical-teams')
export class ProcurementRequisitionTechnicalTeamController extends ExtraCrudController<ProcurementRequisitionTechnicalTeam>(
  options,
) {
  constructor(
    private readonly procurementRequisitionTechnicalTeamService: ProcurementRequisitionTechnicalTeamService,
  ) {
    super(procurementRequisitionTechnicalTeamService);
  }

  @Post('bulk-assign')
  async bulkCreate(
    @Body() technicalTeam: any,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.procurementRequisitionTechnicalTeamService.bulkCreate(
      technicalTeam,
      user.organization.id,
    );
  }
}
