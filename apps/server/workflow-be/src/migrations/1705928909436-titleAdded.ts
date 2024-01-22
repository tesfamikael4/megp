import { MigrationInterface, QueryRunner } from 'typeorm';

export class TitleAdded1705928909436 implements MigrationInterface {
  name = 'TitleAdded1705928909436';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD "title" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "steps" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "default_steps" DROP COLUMN "title"`);
  }
}
