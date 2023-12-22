import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeApproverToAnyOnSteps1703163234625
  implements MigrationInterface
{
  name = 'ChangeApproverToAnyOnSteps1703163234625';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approvers"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvers" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP COLUMN "approvalMethods"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvalMethods" jsonb NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approverTypes"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approverTypes" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approverTypes"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approverTypes" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP COLUMN "approvalMethods"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvalMethods" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approvers"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvers" text NOT NULL`,
    );
  }
}
