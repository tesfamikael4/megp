import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  ExtraCrudController,
  ExtraCrudOptions,
} from 'megp-shared-be';
import { EvalResponse } from 'src/entities';
import { EvalResponseService } from '../services/eval-response.service';
import { CreateEvalResponseDto } from '../dtos/eval-response.dto';
import { DeepPartial } from 'typeorm';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateEvalResponseDto,
};

@ApiBearerAuth()
@Controller('eval-responses')
@ApiTags('Evaluation Responses Controller')
export class EvalResponseController extends ExtraCrudController<EvalResponse>(
  options,
) {
  constructor(private readonly evalReponseService: EvalResponseService) {
    super(evalReponseService);
  }

  @Get('can-submit/:rfxId')
  async canSubmitEvaluation(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
  ) {
    return await this.evalReponseService.canSubmitEvaluation(rfxId, user);
  }

  @Patch('submit/:rfxId')
  async submitEvaluation(@Param('rfxId') rfxId: string) {
    return await this.evalReponseService.submitEvaluation(rfxId);
  }
}
