import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule, RuleDesigner } from 'src/entities';
import { EntityCrudService } from 'megp-shared-be';
import { Repository } from 'typeorm';
import { compareCondition } from './check-conditions.js';
import { CreateRuleDesignerDto } from '../dto/rule-designer.dto.js';

@Injectable()
export class RuleDesignerService extends EntityCrudService<RuleDesigner> {
  constructor(
    @InjectRepository(RuleDesigner)
    private readonly repositoryRuleDesigner: Repository<RuleDesigner>,
  ) {
    super(repositoryRuleDesigner);
  }

  async create(itemData: CreateRuleDesignerDto): Promise<any> {
    const item = await this.repositoryRuleDesigner.save(itemData);
    return item;
  }

  async validate(designKey, params) {
    const designer = await this.repositoryRuleDesigner.findOneOrFail({
      where: { key: designKey },
      relations: ['rules', 'possibleReasons'],
      order: {
        rules: {
          executionOrder: 'ASC',
        },
      },
    });
    let valid = false;

    for (const rule of designer.rules) {
      valid = compareCondition(rule.conditions, params);
      if (valid) {
        return await this.takeAction(designer.actions, valid);
      }
    }

    const possibleReasons = [];
    designer.possibleReasons.forEach((reason) => {
      possibleReasons.push(reason.reason);
    });

    const resp = this.takeAction(designer.defaultActions, false);

    return {
      ...resp,
      enforcementMethod: designer.enforcementMethod,
      possibleReasons: possibleReasons,
    };
  }

  private takeAction(actions, valid: boolean) {
    const resp = {
      validation: valid,
    };
    for (const action of actions) {
      if (action.type == 'set') {
        resp['set'] = {};
        resp['set'][action.name] = action.value;
      } else if (action.type == 'notify') {
        resp['notify'] = {};
        resp['notify'][action.name] = action.value;
      }
    }
    return resp;
  }
}
