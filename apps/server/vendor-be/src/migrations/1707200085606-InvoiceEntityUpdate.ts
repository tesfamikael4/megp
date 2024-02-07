import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceEntityUpdate1707200085606 implements MigrationInterface {
    name = 'InvoiceEntityUpdate1707200085606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" ADD "tenantId" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "serviceId" uuid`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_14e015426d3712bffbe65be18f7" FOREIGN KEY ("serviceId") REFERENCES "bp_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_14e015426d3712bffbe65be18f7"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD "serviceId" character varying`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "tenantId"`);
    }

}
