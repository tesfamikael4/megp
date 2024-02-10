import {
  Controller,
  UseGuards,
  Get,
  Body,
  Param,
  Post,
  Put,
  UseInterceptors,
  UploadedFile,
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
} from '../../vendor-registration/dto/business-area.dto';
import { PreferentailTreatmentService } from '../services/preferentail-treatment.service';
import {
  CreatePTDto,
  PTResponse,
  UpdatePTDto,
} from '../dto/preferentail-treatment.dto';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certificate', maxCount: 1 },
      { name: 'otherDocuments', maxCount: 3 },
    ]),
  )
  @ApiOkResponse({ type: PTResponse })
  async submitApplication(
    @UploadedFiles()
    files: {
      certificate: Express.Multer.File[];
      otherDocuments: Express.Multer.File[];
    },
    @CurrentUser() user: any,
    @Body() createdto: CreatePTDto,
  ) {
    console.log('bb', createdto, files);
    return await this.ptService.submitPreferential(files, createdto, user);
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
}
