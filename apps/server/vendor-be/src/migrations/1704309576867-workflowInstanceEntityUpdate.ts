import { MigrationInterface, QueryRunner } from "typeorm";

export class WorkflowInstanceEntityUpdate1704309576867 implements MigrationInterface {
    name = 'WorkflowInstanceEntityUpdate1704309576867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workflow_instances" DROP CONSTRAINT "FK_d4e1031259ad95ca1bb593200df"`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" DROP COLUMN "pricingId"`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" DROP COLUMN "businessStatus"`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "UQ_0283ff39f20d2c469adee56c71f" UNIQUE ("businessAreaId")`);
        await queryRunner.query(`ALTER TABLE "invoice" ADD CONSTRAINT "FK_0283ff39f20d2c469adee56c71f" FOREIGN KEY ("businessAreaId") REFERENCES "business_areas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "FK_0283ff39f20d2c469adee56c71f"`);
        await queryRunner.query(`ALTER TABLE "invoice" DROP CONSTRAINT "UQ_0283ff39f20d2c469adee56c71f"`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" ADD "businessStatus" character varying`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" ADD "pricingId" uuid`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" ADD CONSTRAINT "FK_d4e1031259ad95ca1bb593200df" FOREIGN KEY ("pricingId") REFERENCES "service_pricing"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
