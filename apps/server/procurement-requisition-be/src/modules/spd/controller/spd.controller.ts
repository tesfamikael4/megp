import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdService } from '../service/spd.service';
import { Spd } from 'src/entities/spd.entity';
import { CreateSpdDto, UpdateSpdDto } from '../dto/spd.dto';
import { AllowAnonymous } from 'src/shared/authorization';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

const options: EntityCrudOptions = {
  createDto: CreateSpdDto,
  updateDto: UpdateSpdDto,
};

@ApiBearerAuth()
@Controller('spd')
@ApiTags('Spd Controller')
export class SpdController extends EntityCrudController<Spd>(options) {
  constructor(private readonly spdService: SpdService) {
    super(spdService);
  }

  @Post('/upload-spd')
  @AllowAnonymous()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSPDDocument(@UploadedFile() file: Express.Multer.File) {
    return this.spdService.uploadSPDDocument(file);
  }

  @Post('/download-spd')
  @AllowAnonymous()
  async downloadSPDDocument(@Body() file: any, @Res() response: Response) {
    return this.spdService.downloadSPDDocument(file, response);
  }
}
