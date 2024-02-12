import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederConstructor, runSeeder } from 'typeorm-extension';

import { dataSourceOptions } from 'megp-shared-be';

import { seedDesigns, seedPossibleReasons, seedRules } from './seed-data';
import { seedRuleHandlerOptions, seedRuleHandlers } from './seed-rule-handlers';
import {
  Rule,
  RuleDesigner,
  RuleHandler,
  RuleHandlerOptions,
} from 'src/entities';
import { PossibleReasons } from 'src/entities/possible-reasons.entity';

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
    const repositoryPossibleReasons: Repository<PossibleReasons> =
      dataSource.getRepository(PossibleReasons);

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

    await repositoryPossibleReasons.upsert(seedPossibleReasons as any, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['reason'],
    });

    dataSource.destroy();
  }
}

const dataSource = new DataSource(dataSourceOptions);
const applicationSeederConstructor: SeederConstructor = DataSeeder;
(async () => {
  await runSeeder(dataSource, applicationSeederConstructor);
})();
