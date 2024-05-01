import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TenderSpd } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderSpdService } from '../service/tender-spd.service';
import { CreateTenderSpdDto } from '../dto';
import { AllowAnonymous } from 'src/shared/authorization';
import { FileInterceptor } from '@nestjs/platform-express';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateTenderSpdDto,
};

@ApiBearerAuth()
@Controller('tender-spd')
@ApiTags('Tender Spd Controller')
export class TenderSpdController extends ExtraCrudController<TenderSpd>(
  options,
) {
  constructor(private readonly tenderSpdService: TenderSpdService) {
    super(tenderSpdService);
  }

  @Get('/download-bds/:tenderId')
  @AllowAnonymous()
  async downloadBds(@Param('tenderId') tenderId: string) {
    return await this.tenderSpdService.downloadBds(tenderId);
  }

  @Post('/upload-bds/:tenderId')
  @AllowAnonymous()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBds(
    @Param('tenderId') tenderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.tenderSpdService.uploadBds(tenderId, file);
  }

  @Get('/download-scc/:tenderId')
  @AllowAnonymous()
  async downloadScc(@Param('tenderId') tenderId: string) {
    return await this.tenderSpdService.downloadScc(tenderId);
  }

  @Post('/upload-scc/:tenderId')
  @AllowAnonymous()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadScc(
    @Param('tenderId') tenderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.tenderSpdService.uploadScc(tenderId, file);
  }
}
