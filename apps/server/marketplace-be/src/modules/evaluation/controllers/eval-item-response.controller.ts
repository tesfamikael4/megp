import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { EvalItemResponse } from 'src/entities';
import { EvalItemResponseService } from '../services/eval-item-response.service';
import { CreateEvalItemResponseDto } from '../dtos/eval-item-response.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
  createDto: CreateEvalItemResponseDto,
};

@ApiBearerAuth()
@Controller('eval-item-responses')
@ApiTags('Evaluation Item Responses Controller')
export class EvalItemResponseController extends ExtraCrudController<EvalItemResponse>(
  options,
) {
  constructor(
    private readonly evalItemResponseService: EvalItemResponseService,
  ) {
    super(evalItemResponseService);
  }
}
