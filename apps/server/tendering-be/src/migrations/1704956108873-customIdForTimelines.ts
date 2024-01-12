import { MigrationInterface, QueryRunner } from 'typeorm';

export class CustomIdForTimelines1704956108873 implements MigrationInterface {
  name = 'CustomIdForTimelines1704956108873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ALTER COLUMN "id" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisition_timelines" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
  }
}
