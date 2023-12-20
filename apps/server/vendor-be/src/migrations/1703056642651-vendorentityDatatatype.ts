import { MigrationInterface, QueryRunner } from 'typeorm';

export class VendorentityDatatatype1703056642651 implements MigrationInterface {
  name = 'VendorentityDatatatype1703056642651';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_areas" ADD "certificateUrl" character varying`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "business_areas" DROP COLUMN "certificateUrl"`,
    );
  }
}
