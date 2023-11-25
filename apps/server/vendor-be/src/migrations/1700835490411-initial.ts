import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1700835490411 implements MigrationInterface {
  name = 'Initial1700835490411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_areas" ALTER COLUMN "approvedAt" SET DEFAULT '"2023-11-24T14:18:17.026Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_areas" ALTER COLUMN "approvedAt" SET DEFAULT '2023-11-24 14:05:14.688'`,
    );
  }
}
