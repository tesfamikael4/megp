import {
  Controller,
  Post,
  Param,
  Body,
  Query,
  Get,
  Patch,
} from '@nestjs/common';
import {
  AllowAnonymous,
  CurrentUser,
  EntityCrudController,
  EntityCrudOptions,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { RFX } from 'src/entities';
import { RfxService } from '../services/rfx.service';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateRFXDto, UpdateRFXDto } from '../dtos/rfx.dto';
import { EventPattern } from '@nestjs/microservices';
import currentTime from 'src/utils/services/time-provider';

const options: EntityCrudOptions = {
  createDto: CreateRFXDto,
  updateDto: UpdateRFXDto,
};
@Controller('rfxs')
@ApiTags('RFX')
@ApiBearerAuth()
export class RfxController extends EntityCrudController<RFX>(options) {
  constructor(private readonly rfxService: RfxService) {
    super(rfxService);
  }

  @Get('preparation')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getPreparationRfxes(@CurrentUser() user: any, @Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.rfxService.getPreparationRfxes(query, user);
  }

  @Get('evaluation')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getEvaluationRfxes(@CurrentUser() user: any, @Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.rfxService.getEvaluationRfxes(query, user);
  }

  @Get('revision')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async rfxesOnReviewal(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.rfxService.getRfxesOnReviewal(query);
  }

  @Patch('cancel/:rfxId')
  async cancelRfx(@Param('rfxId') rfxId: string) {
    return await this.rfxService.cancelRfx(rfxId);
  }

  @Get('closed-rfxs')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async closedRfx(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.rfxService.getClosedRfx(query);
  }

  @Post('make-rfx-open/:rfxId')
  async makeRfxOpen(@Param('rfxId') rfxId: string) {
    return await this.rfxService.makeOpenRfx(rfxId);
  }

  @Post('make-close-rfx/:rfxId')
  async makeRfxClose(@Param('rfxId') rfxId: string) {
    return await this.rfxService.makeCloseRfx(rfxId);
  }

  @Post('review/:rfxId')
  async submitForReview(
    @Param('rfxId') rfxId: string,
    @Body() payload: UpdateRFXDto,
  ) {
    return await this.rfxService.submitForReview(rfxId, payload);
  }

  @Post('submit/:rfxId')
  async submitRfx(@Param('rfxId') rfxId: string) {
    return this.rfxService.submitRfx(rfxId);
  }

  @Post('workflow-response')
  @ApiBody({})
  @EventPattern('workflow-approval.rfxApproval')
  async workflowResponse(@Body() data: any) {
    return this.rfxService.handleWorkflowResponse(data);
  }

  @Get('current-time')
  @AllowAnonymous()
  getCurrentTime() {
    return new Date();
  }
}
