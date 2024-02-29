import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceEntityUpdates1709222691040 implements MigrationInterface {
    name = 'InvoiceEntityUpdates1709222691040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "serviceName"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ADD "serviceName" character varying NOT NULL`);
    }

}
