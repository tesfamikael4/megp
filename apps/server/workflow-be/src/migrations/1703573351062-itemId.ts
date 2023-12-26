import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemId1703573351062 implements MigrationInterface {
  name = 'ItemId1703573351062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "instances" ADD "itemId" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "instances" DROP COLUMN "itemId"`);
  }
}
