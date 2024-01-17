import { Controller } from '@nestjs/common';
import { EntityCrudController } from 'src/shared/controller';
import { ApiTags } from '@nestjs/swagger';
import { RuleHandlerOptions } from 'src/entities';
import { RuleHandlerOptionsService } from '../services/rule-handler-options.service';

@Controller('rule-handler-option')
@ApiTags('rule-handler-option')
export class RuleHandlerOptionsController extends EntityCrudController<RuleHandlerOptions>(
  {},
) {
  constructor(
    private readonly ruleHandlerOptionsService: RuleHandlerOptionsService,
  ) {
    super(ruleHandlerOptionsService);
  }
}
