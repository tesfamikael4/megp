import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignerDefaultAction1705569011455 implements MigrationInterface {
  name = 'DesignerDefaultAction1705569011455';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_designer" ADD "defaultActions" jsonb NOT NULL DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rule_designer" DROP COLUMN "defaultActions"`,
    );
  }
}
