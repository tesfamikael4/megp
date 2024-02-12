import { Controller, Get } from '@nestjs/common';
import { RuleHandler } from 'src/entities';
import { EntityCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { RuleHandlerService } from '../services/rule-handler.service';

@Controller('rule-handler')
@ApiTags('rule-handler')
export class RuleHandlerController extends EntityCrudController<RuleHandler>(
  {},
) {
  constructor(private readonly ruleHandlerService: RuleHandlerService) {
    super(ruleHandlerService);
  }

  @Get('with-relation')
  async findAllWithRelation() {
    return this.ruleHandlerService.findAllWithRelation();
  }
}
