import { MigrationInterface, QueryRunner } from 'typeorm';

export class GiveDefaultValues1704010490021 implements MigrationInterface {
  name = 'GiveDefaultValues1704010490021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" DROP CONSTRAINT "FK_53da30deab7754da9706402bd13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" DROP CONSTRAINT "REL_53da30deab7754da9706402bd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD "unitPrice" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD "quantity" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_disbursements" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_disbursements" ADD "amount" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_budget_lines" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_budget_lines" ADD "amount" double precision NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "totalEstimatedAmount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "calculatedAmount" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ALTER COLUMN "annualProcurementPlan" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ADD CONSTRAINT "UQ_8a4c06c7511ae4d88b8165ccc90" UNIQUE ("procurementRequisitionId", "annualProcurementPlanActivityId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" ADD CONSTRAINT "FK_53da30deab7754da9706402bd13" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" DROP CONSTRAINT "FK_53da30deab7754da9706402bd13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" DROP CONSTRAINT "UQ_8a4c06c7511ae4d88b8165ccc90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_activities" ALTER COLUMN "annualProcurementPlan" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "calculatedAmount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "totalEstimatedAmount" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_budget_lines" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_budget_lines" ADD "amount" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_disbursements" DROP COLUMN "amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_disbursements" ADD "amount" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD "quantity" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" DROP COLUMN "unitPrice"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_items" ADD "unitPrice" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" ADD CONSTRAINT "REL_53da30deab7754da9706402bd1" UNIQUE ("procurementRequisitionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_officer_assignments" ADD CONSTRAINT "FK_53da30deab7754da9706402bd13" FOREIGN KEY ("procurementRequisitionId") REFERENCES "procurement_requisitions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
