import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { RfxRevisionApproval } from 'src/entities';
import { RfxRevisionApprovalService } from '../services/rfx-revision-approval.service';
import {
  CreateRevisionApprovalDto,
  UpdateRevisionApprovalDto,
} from '../dtos/rfx-revision-approval.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRevisionApprovalDto,
  updateDto: UpdateRevisionApprovalDto,
};

@ApiBearerAuth()
@Controller('rfx-revision-approvals')
@ApiTags('Rfx Revision Approval Controller')
export class RfxRevisionApprovalController extends ExtraCrudController<RfxRevisionApproval>(
  options,
) {
  constructor(
    private readonly revisionApprovalService: RfxRevisionApprovalService,
  ) {
    super(revisionApprovalService);
  }

  @Post()
  @ApiBody({})
  async create(@Body() itemData: any, @CurrentUser() user): Promise<any> {
    return await this.revisionApprovalService.create(itemData, user);
  }

  @Get('can-submit/:rfxId')
  async canSubmit(@Param('rfxId') rfxId: string, @CurrentUser() user: any) {
    return await this.revisionApprovalService.canSubmit(rfxId, user);
  }
}
