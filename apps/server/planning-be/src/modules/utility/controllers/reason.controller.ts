import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { EntityCrudController } from 'src/shared/controller';
import { Reason } from 'src/entities/reason.entity';
import { ReasonService } from '../services/reason.service';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { AllowAnonymous } from 'src/shared/authorization';

const options: EntityCrudOptions = {};

@Controller('reasons')
@ApiTags('reasons')
export class ReasonController extends EntityCrudController<Reason>(options) {
  constructor(private readonly reasonService: ReasonService) {
    super(reasonService);
  }

  // @AllowAnonymous()
  // @Post('pdf-generate')
  // async pdfGenerate(@Body() hash, @Res() response) {
  //   const buffer = await this.reasonService.pdfGenerator();
  //   response.setHeader('Content-Type', 'application/pdf');
  //   response.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');

  //   // Send buffer as response
  //   response.send(buffer);
  // }
}
