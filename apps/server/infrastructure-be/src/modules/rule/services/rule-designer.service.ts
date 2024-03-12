import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PossibleReasons, Rule, RuleDesigner } from 'src/entities';
import { ENTITY_MANAGER_KEY, EntityCrudService } from 'megp-shared-be';
import { EntityManager, Repository } from 'typeorm';
import { compareCondition } from './check-conditions.js';
import {
  CreateRuleDesignerDto,
  UpdateRuleDesignerDto,
} from '../dto/rule-designer.dto.js';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RuleDesignerService extends EntityCrudService<RuleDesigner> {
  constructor(
    @InjectRepository(RuleDesigner)
    private readonly repositoryRuleDesigner: Repository<RuleDesigner>,
    @Inject(REQUEST)
    private readonly request: Request,
  ) {
    super(repositoryRuleDesigner);
  }

  async create(itemData: CreateRuleDesignerDto): Promise<any> {
    const item = await this.repositoryRuleDesigner.save(itemData);
    return item;
  }

  async update(
    designerId: string,
    itemData: UpdateRuleDesignerDto,
  ): Promise<any> {
    const entityManager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const ruleDesign = this.repositoryRuleDesigner.create(itemData);
    await entityManager
      .getRepository(RuleDesigner)
      .upsert(itemData, { conflictPaths: ['id'] });

    if (ruleDesign.rules?.length > 0)
      await entityManager
        .getRepository(Rule)
        .upsert(itemData.rules, { conflictPaths: ['designerId', 'key'] });

    if (ruleDesign.possibleReasons?.length > 0)
      await entityManager
        .getRepository(PossibleReasons)
        .upsert(itemData.possibleReasons, { conflictPaths: ['id'] });

    return ruleDesign;
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
