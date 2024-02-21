import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnSpdTemaplate1708504285849 implements MigrationInterface {
  name = 'UpdateOnSpdTemaplate1708504285849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_templates" DROP COLUMN "document"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" ADD "documentDocx" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" ADD "documentPdf" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_templates" DROP COLUMN "documentPdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" DROP COLUMN "documentDocx"`,
    );
    await queryRunner.query(`ALTER TABLE "spd_templates" ADD "document" jsonb`);
  }
}
