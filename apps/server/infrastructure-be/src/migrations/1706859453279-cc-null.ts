import { MigrationInterface, QueryRunner } from 'typeorm';

export class CcNull1706859453279 implements MigrationInterface {
  name = 'CcNull1706859453279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "cc" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "cc" SET NOT NULL`,
    );
  }
}
