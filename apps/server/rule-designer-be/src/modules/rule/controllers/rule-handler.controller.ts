import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Rule, RuleHandler } from 'src/entities';
import { EntityCrudController } from 'src/shared/controller';
import { RuleService } from '../services/rule.service';
import { ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateRuleDto, UpdateRuleDto } from '../dto/rule.dto';
import { RuleHandlerService } from '../services/rule-handler.service';
import { DataResponseFormat } from 'src/shared/api-data';
import { decodeCollectionQuery } from 'src/shared/collection-query';

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
