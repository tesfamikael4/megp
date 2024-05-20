import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderModel1716038449768 implements MigrationInterface {
  name = 'UpdateOnTenderModel1716038449768';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP COLUMN "marketEstimate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "marketEstimate" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP COLUMN "marketEstimate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "marketEstimate" integer NOT NULL`,
    );
  }
}
