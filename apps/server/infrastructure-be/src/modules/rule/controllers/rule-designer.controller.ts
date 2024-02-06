import { Body, Controller, Param, Post } from '@nestjs/common';
import { EntityCrudController } from 'src/shared/controller';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RuleDesigner } from 'src/entities/rule-designer.entity';
import {
  CreateRuleDesignerDto,
  UpdateRuleDesignerDto,
} from '../dto/rule-designer.dto';
import { RuleDesignerService } from '../services/rule-designer.service';
import { ValidateRuleDto } from '../dto/validate-rule.dto';
// import { ValidateRuleDto } from '../dto/validate-rule.dto';

@Controller('rule-designer')
@ApiTags('rule-designer')
export class RuleDesignerController extends EntityCrudController<RuleDesigner>({
  createDto: CreateRuleDesignerDto,
  updateDto: UpdateRuleDesignerDto,
}) {
  constructor(private readonly ruleDesignerService: RuleDesignerService) {
    super(ruleDesignerService);
  }

  @Post('validate/:designKey')
  @ApiBody({})
  async validate(@Param('designKey') designKey: string, @Body() params: any) {
    return await this.ruleDesignerService.validate(designKey, params);
  }
}
