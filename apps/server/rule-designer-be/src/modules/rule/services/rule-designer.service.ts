import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RuleDesigner } from 'src/entities';
import { EntityCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';
import { compareCondition } from './check-conditions.js';

@Injectable()
export class RuleDesignerService extends EntityCrudService<RuleDesigner> {
  constructor(
    @InjectRepository(RuleDesigner)
    private readonly repositoryRuleDesigner: Repository<RuleDesigner>,
  ) {
    super(repositoryRuleDesigner);
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
        return await this.takeAction(designer.actions);
      }
    }
    return {
      validation: false,
      enforcementMethod: designer.enforcementMethod,
      possibleReasons: designer.possibleReasons,
    };
  }

  private async takeAction(actions) {
    const resp = {
      validation: true,
      set: {},
      notify: {},
    };
    for (const action of actions) {
      if (action.type == 'set') {
        resp['set'][action.name] = action.value;
      } else if (action.type == 'notify') {
        resp['notify'][action.names] = action.value;
      }
    }
    return resp;
  }
}
