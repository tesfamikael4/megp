import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReasonObjectIdNullable1710870316397 implements MigrationInterface {
  name = 'ReasonObjectIdNullable1710870316397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" ALTER COLUMN "objectId" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reasons" ALTER COLUMN "objectId" SET NOT NULL`,
    );
  }
}
