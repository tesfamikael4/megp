import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceEntityChange1713863880601 implements MigrationInterface {
    name = 'InvoiceEntityChange1713863880601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ADD "paymentLink" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "paymentLink"`);
    }

}
