import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessAreatributeForAll1703772299077
  implements MigrationInterface {
  name = 'BusinessAreatributeForAll1703772299077';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" RENAME COLUMN "instanceId" TO "businessAreaId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" RENAME COLUMN "businessAreaId" TO "instanceId"`,
    );
  }
}
