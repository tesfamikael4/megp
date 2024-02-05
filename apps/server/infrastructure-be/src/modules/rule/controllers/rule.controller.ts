import { Controller } from '@nestjs/common';
import { Rule } from 'src/entities';
import { RuleService } from '../services/rule.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRuleDto, UpdateRuleDto } from '../dto/rule.dto';
import { ExtraCrudOptions, ExtraCrudController } from '@megp/shared-be';

const options: ExtraCrudOptions = {
  entityIdName: 'designerId',
  createDto: CreateRuleDto,
  updateDto: UpdateRuleDto,
};
@Controller('rule')
@ApiTags('rule')
export class RuleController extends ExtraCrudController<Rule>(options) {
  constructor(private readonly ruleService: RuleService) {
    super(ruleService);
  }
}
