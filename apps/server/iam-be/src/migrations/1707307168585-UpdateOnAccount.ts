import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnAccount1707307168585 implements MigrationInterface {
  name = 'UpdateOnAccount1707307168585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "email" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ALTER COLUMN "email" SET NOT NULL`,
    );
  }
}
