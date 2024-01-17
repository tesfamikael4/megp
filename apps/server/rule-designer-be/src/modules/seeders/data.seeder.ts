import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederConstructor, runSeeder } from 'typeorm-extension';

import dataSource from 'src/shared/typeorm/typeorm-config-helper';

import { seedDesigns, seedRules } from './seed-data';
import { seedRuleHandlerOptions, seedRuleHandlers } from './seed-rule-handlers';
import {
  Rule,
  RuleDesigner,
  RuleHandler,
  RuleHandlerOptions,
} from 'src/entities';

@Injectable()
export class DataSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    await dataSource.initialize();

    const repositoryRuleDesigner: Repository<RuleDesigner> =
      dataSource.getRepository(RuleDesigner);
    const repositoryRule: Repository<Rule> = dataSource.getRepository(Rule);
    const repositoryRuleHandler: Repository<RuleHandler> =
      dataSource.getRepository(RuleHandler);
    const repositoryRuleHandlerOptions: Repository<RuleHandlerOptions> =
      dataSource.getRepository(RuleHandlerOptions);

    await repositoryRuleDesigner.upsert(seedDesigns as any, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });

    await repositoryRule.upsert(seedRules as any, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });

    await repositoryRuleHandler.upsert(seedRuleHandlers as any, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });

    await repositoryRuleHandlerOptions.upsert(seedRuleHandlerOptions as any, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['key'],
    });
  }
}

const applicationSeederConstructor: SeederConstructor = DataSeeder;
(async () => {
  await runSeeder(dataSource, applicationSeederConstructor);
})();
