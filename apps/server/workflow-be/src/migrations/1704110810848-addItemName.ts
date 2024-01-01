import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemName1704110810848 implements MigrationInterface {
  name = 'AddItemName1704110810848';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "itemName" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "itemName"`);
  }
}
