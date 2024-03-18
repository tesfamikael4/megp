import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceEntityUpdates1710671855513 implements MigrationInterface {
    name = 'InvoiceEntityUpdates1710671855513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ADD "paymentMethod" character varying NOT NULL DEFAULT 'Manual'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "UQ_be492a442ed9d10e896d0f0c203" UNIQUE ("refNumber")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "UQ_be492a442ed9d10e896d0f0c203"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentMethod"`);
    }

}
