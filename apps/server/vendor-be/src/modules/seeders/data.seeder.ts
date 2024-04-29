import {
  BanksEntity,
  BpServiceEntity,
  BusinessProcessEntity,
  Category,
  ServicePrice,
  TaskAssignmentEntity,
  TaskEntity,
} from '@entities';
import { DataSource, Repository } from 'typeorm';
import { Seeder, SeederConstructor, runSeeder } from 'typeorm-extension';
import dataSource from 'src/shared/typeorm/typeorm-config-helper';
import { Injectable } from '@nestjs/common';
import { seedBanks } from './seed-banks';
import { seedBps } from './seed-bps';
import { seedTasks } from './seed-tasks';
import { seedCategories } from './seed-categories';
import { seedPrices } from './seed-prices';
import { seedServices } from './seed-services';

@Injectable()
export class DataSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<any> {
    await dataSource.initialize();
    const serviceRepository: Repository<BpServiceEntity> =
      dataSource.getRepository(BpServiceEntity);
    const bpRepository: Repository<BusinessProcessEntity> =
      dataSource.getRepository(BusinessProcessEntity);
    const taskRepository: Repository<TaskEntity> =
      dataSource.getRepository(TaskEntity);
    const categoryRepository: Repository<Category> =
      dataSource.getRepository(Category);
    const bankRepository: Repository<BanksEntity> =
      dataSource.getRepository(BanksEntity);
    const pricingRepository: Repository<ServicePrice> =
      dataSource.getRepository(ServicePrice);
    const assignmentRepository: Repository<TaskAssignmentEntity> =
      dataSource.getRepository(TaskAssignmentEntity);

    await serviceRepository.upsert(seedServices, ['id']);
    await bpRepository.upsert(seedBps, ['id']);
    await taskRepository.upsert(seedTasks, ['id']);
    await categoryRepository.upsert(seedCategories, ['id']);
    await bankRepository.upsert(seedBanks as any, ['id']);
    await pricingRepository.upsert(seedPrices, ['id']);

    //will be addedd later
    //   await assignmentRepository.save(assigmentsToSeed);
  }
}
const applicationSeederConstructor: SeederConstructor = DataSeeder;
(async () => {
  await runSeeder(dataSource, applicationSeederConstructor);
})();
