import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorentityDatatatype1703578834355 implements MigrationInterface {
  name = 'VendorentityDatatatype1703578834355';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_areas" ADD "businessAreaState" jsonb NOT NULL DEFAULT '{"status":"Draft","level":"Info"}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_areas" DROP COLUMN "businessAreaState"`,
    );
  }
}
