import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserReference1714124653976 implements MigrationInterface {
  name = 'AddUserReference1714124653976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "isUsed" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_requisitions" ALTER COLUMN "isUsed" DROP DEFAULT`,
    );
  }
}
