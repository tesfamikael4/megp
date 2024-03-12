import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { RuleHandlerOptions } from 'src/entities';
import { RuleHandlerOptionsService } from '../services/rule-handler-options.service';
import { ExtraCrudOptions } from 'megp-shared-be';

const option: ExtraCrudOptions = {
  entityIdName: 'ruleHandlerId',
};
@Controller('rule-handler-options')
@ApiTags('rule-handler-options')
export class RuleHandlerOptionsController extends ExtraCrudController<RuleHandlerOptions>(
  option,
) {
  constructor(
    private readonly ruleHandlerOptionsService: RuleHandlerOptionsService,
  ) {
    super(ruleHandlerOptionsService);
  }
}
