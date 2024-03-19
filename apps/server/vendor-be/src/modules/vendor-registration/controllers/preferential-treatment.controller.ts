import {
  Controller,
  UseGuards,
  Get,
  Body,
  Param,
  Post,
  Put,
  UseInterceptors,
  Delete,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOkResponse } from '@nestjs/swagger';
import { JwtGuard, CurrentUser } from 'src/shared/authorization';
import { PreferentialTreatmentsEntity } from 'src/entities/preferential-treatment.entity';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateBusinessAreaDto,
  UpdateBusinessAreaDto,
} from '../dto/business-area.dto';
import { PreferentailTreatmentService } from '../services/preferentail-treatment.service';
import {
  CreatePTDto,
  PTResponse,
  UpdatePTDto,
} from '../../preferentials/dto/preferentail-treatment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
const options: EntityCrudOptions = {
  createDto: CreateBusinessAreaDto,
  updateDto: UpdateBusinessAreaDto,
};
@Controller('preferentail-treatment')
@ApiTags('Preferentail Treatment')
@UseGuards(JwtGuard)
@ApiResponse({ status: 500, description: 'Internal error' })
export class PreferentailTreatmentsController extends EntityCrudController<PreferentialTreatmentsEntity>(
  options,
) {
  constructor(private ptService: PreferentailTreatmentService) {
    super(ptService);
  }
  @Post()
  @ApiOkResponse({ type: PTResponse })
  async create(@Body() dto: CreatePTDto) {
    return await super.create(dto);
  }

  @Put('/:id')
  @ApiOkResponse({ type: PTResponse })
  async update(@Param('id') id: string, @Body() dto: UpdatePTDto) {
    return await super.update(id, dto);
  }

  @Post('submit-pt-request')
  // @ApiBody({ type: [CreatePTDto] })
  @ApiOkResponse({ type: PTResponse })
  async submitApplication(
    @CurrentUser() user: any,
    @Body() createdto: CreatePTDto[],
  ) {
    return await this.ptService.submitPreferential(createdto, user);
  }
  @Post('upload-preferential-attachments')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'ibmCerti', maxCount: 1 },
      { name: 'msmeCerti', maxCount: 1 },
      { name: 'marginalizedCerti', maxCount: 1 },
    ]),
  )
  @ApiOkResponse({ type: PTResponse })
  async uploadPreferentialAttachments(
    @UploadedFiles() files,
    @CurrentUser() user: any,
  ) {
    return await this.ptService.uploadPreferentialAttachments(files, user);
  }

  @Get('get-draft-pt-applications')
  async getDraftPreferetialTretments(@CurrentUser() user: any) {
    return await this.ptService.getDraftPreferentialApplications(user);
  }
  @Delete('delete-draft-pt-application/:id')
  async deleteDraftPreferetialTretment(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return await this.ptService.delete(id, user);
  }

  @Get('get-unregistered-preferential-services')
  async getUnregisteredPreferentials(@CurrentUser() user: any) {
    return await this.ptService.getUnregisteredPreferentials(user);
  }
}
