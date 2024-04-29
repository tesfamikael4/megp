import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderPersonal1714222414636 implements MigrationInterface {
  name = 'UpdateOnTenderPersonal1714222414636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_personals" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" ADD "order" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_personals" DROP COLUMN "order"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" ADD "order" character varying NOT NULL`,
    );
  }
}
