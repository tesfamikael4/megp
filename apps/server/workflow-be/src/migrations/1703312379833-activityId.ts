import { MigrationInterface, QueryRunner } from 'typeorm';

export class ActivityId1703312379833 implements MigrationInterface {
  name = 'ActivityId1703312379833';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP COLUMN "approvers"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD "approvers" jsonb NOT NULL`,
    );
  }
}
