import { BanksEntity, BpServiceEntity, BusinessProcessEntity, Category, ServicePrice, TaskAssignmentEntity, TaskEntity } from "@entities";
import { DataSource, Repository } from "typeorm";
import { Seeder, SeederConstructor, runSeeder } from "typeorm-extension";
import { banksToSeed, bpsToSeed, categoriesToSeed, pricesToSeed, servicesToSeed, tasksToSeed } from "./seed-data";
import dataSource from "src/shared/typeorm/typeorm-config-helper";
import { Injectable } from "@nestjs/common";
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

        await serviceRepository.save(servicesToSeed);
        await bpRepository.save(bpsToSeed);
        await taskRepository.save(tasksToSeed);
        await categoryRepository.save(categoriesToSeed);
        await bankRepository.save(banksToSeed);
        await pricingRepository.save(pricesToSeed);
        //will be addedd later
        //   await assignmentRepository.save(assigmentsToSeed);

    }

}
const applicationSeederConstructor: SeederConstructor = DataSeeder;
(async () => {
    await runSeeder(dataSource, applicationSeederConstructor);
})();