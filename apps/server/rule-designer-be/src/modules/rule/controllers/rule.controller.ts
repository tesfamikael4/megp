import { Body, Controller, Param, Post } from '@nestjs/common';
import { Rule } from 'src/entities';
import { EntityCrudController } from 'src/shared/controller';
import { RuleService } from '../services/rule.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateRuleDto, UpdateRuleDto } from '../dto/rule.dto';

@Controller('rule')
@ApiTags('rule')
export class RuleController extends EntityCrudController<Rule>({
  createDto: CreateRuleDto,
  updateDto: UpdateRuleDto,
}) {
  constructor(private readonly ruleService: RuleService) {
    super(ruleService);
  }
}
