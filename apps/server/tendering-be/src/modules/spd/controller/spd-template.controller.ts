import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import {
  EntityCrudOptions,
  ExtraCrudOptions,
} from 'src/shared/types/crud-option.type';
import { SpdService } from '../service/spd.service';
import { CreateSpdDto, UpdateSpdDto } from '../dto/spd.dto';
import { AllowAnonymous } from 'src/shared/authorization';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SpdTemplate } from 'src/entities/spd-template.entity';
import { SpdTemplateService } from '../service/spd-template.service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
};

@ApiBearerAuth()
@Controller('spd-templates')
@ApiTags('Spd Template Controller')
export class SpdTemplateController extends ExtraCrudController<SpdTemplate>(
  options,
) {
  constructor(private readonly spdService: SpdTemplateService) {
    super(spdService);
  }

  @Post('/upload-spd')
  @AllowAnonymous()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSPDDocument(
    @Body() payload: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.spdService.uploadSPDDocument(payload, file);
  }

  @Get('/download-spd/:id/:type')
  @AllowAnonymous()
  async downloadSPDDocument(
    @Param('id') id: string,
    @Param('type') type: string,
    @Res() response: Response,
  ) {
    return this.spdService.downloadSPDDocument(id, type, response);
  }
}
