import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeSteps1702923255149 implements MigrationInterface {
  name = 'ChangeSteps1702923255149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "rule"`);
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approvalMethods" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "approverTypes" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "type" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "approverTypes"`);
    await queryRunner.query(
      `ALTER TABLE "steps" DROP COLUMN "approvalMethods"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "rule" character varying NOT NULL`,
    );
  }
}
