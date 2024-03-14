import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PossibleReasons, Rule, RuleDesigner } from 'src/entities';
import { ENTITY_MANAGER_KEY, EntityCrudService } from 'megp-shared-be';
import { EntityManager, In, Repository } from 'typeorm';
import { compareCondition } from './check-conditions.js';
import {
  CreateRuleDesignerDto,
  UpdateRuleDesignerDto,
} from '../dto/rule-designer.dto.js';
import { REQUEST } from '@nestjs/core';
import { ValidateMultipleRuleDto } from '../dto/validate-rule.dto.js';

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
  async bulkValidate(validateMultipleRuleDto: ValidateMultipleRuleDto) {
    const ruleDesigns = await this.repositoryRuleDesigner.find({
      where: { key: In(validateMultipleRuleDto.designerKeys) },
      relations: ['rules', 'possibleReasons'],
      order: {
        rules: {
          executionOrder: 'ASC',
        },
      },
    });

    if (ruleDesigns.length == 0) {
      throw new NotFoundException(`no_rule_designers_found`);
    }

    // if (ruleDesigns.length != validateMultipleRuleDto.designerKeys.length) {
    //   throw new NotFoundException(
    //     `some rule designer not found for keys ${validateMultipleRuleDto.designerKeys.join(', ')}`,
    //   );
    // }

    const failedRuleKeys = [];
    const possibleReasons = new Set([]);

    const resp = {
      validation: true,
      failedRuleKeys,
      possibleReasons: [],
    };

    for (const designer of ruleDesigns) {
      const result = this.validateDesignerAndTakeAction(
        designer,
        validateMultipleRuleDto.params,
      );
      if (result.validation == false) {
        failedRuleKeys.push(designer.key);
        designer.possibleReasons.forEach((reason) => {
          possibleReasons.add(reason.reason);
        });
        resp.validation = false;
      }
    }

    resp.possibleReasons = [...possibleReasons];
    return resp;
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
    return this.validateDesignerAndTakeAction(designer, params);
  }

  private validateDesignerAndTakeAction(designer, params) {
    let valid = false;

    for (const rule of designer.rules) {
      valid = compareCondition(rule.conditions, params);
      if (valid) {
        return this.takeAction(designer.actions, valid);
      }
    }

    const resp = this.takeAction(designer.defaultActions, false);

    return {
      ...resp,
      enforcementMethod: designer.enforcementMethod,
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
