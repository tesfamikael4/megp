import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnItemModel1709142951947 implements MigrationInterface {
  name = 'UpdateOnItemModel1709142951947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "metaData" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "items" ALTER COLUMN "metaData" SET NOT NULL`,
    );
  }
}
