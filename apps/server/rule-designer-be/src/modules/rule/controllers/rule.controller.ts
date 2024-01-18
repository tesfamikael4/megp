import { Body, Controller, Param, Post } from '@nestjs/common';
import { Rule } from 'src/entities';
import {
  EntityCrudController,
  ExtraCrudController,
} from 'src/shared/controller';
import { RuleService } from '../services/rule.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateRuleDto, UpdateRuleDto } from '../dto/rule.dto';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';

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
