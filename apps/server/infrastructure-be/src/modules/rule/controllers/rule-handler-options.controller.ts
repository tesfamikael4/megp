import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';
import { ApiTags } from '@nestjs/swagger';
import { RuleHandlerOptions } from 'src/entities';
import { RuleHandlerOptionsService } from '../services/rule-handler-options.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';

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
