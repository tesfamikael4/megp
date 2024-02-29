import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceEntityUpdates1709225281695 implements MigrationInterface {
    name = 'InvoiceEntityUpdates1709225281695'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ADD "paymentDetail" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentDetail"`);
    }

}
