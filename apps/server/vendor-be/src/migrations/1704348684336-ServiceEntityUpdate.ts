import { MigrationInterface, QueryRunner } from "typeorm";

export class ServiceEntityUpdate1704348684336 implements MigrationInterface {
    name = 'ServiceEntityUpdate1704348684336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "taskId"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "taskName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ADD "taskName" character varying`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "taskId" uuid`);
    }

}
