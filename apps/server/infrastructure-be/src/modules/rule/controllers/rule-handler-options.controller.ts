import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RuleHandlerOptions } from 'src/entities';
import { RuleHandlerOptionsService } from '../services/rule-handler-options.service';
import { ExtraCrudOptions, ExtraCrudController } from '@megp/shared-be';

const option: ExtraCrudOptions = {
  entityIdName: 'ruleHandlerId',
};
@Controller('rule-handler-option')
@ApiTags('rule-handler-option')
export class RuleHandlerOptionsController extends ExtraCrudController<RuleHandlerOptions>(
  option,
) {
  constructor(
    private readonly ruleHandlerOptionsService: RuleHandlerOptionsService,
  ) {
    super(ruleHandlerOptionsService);
  }
}
