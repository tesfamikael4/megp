import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionId1703320869525 implements MigrationInterface {
  name = 'PermissionId1703320869525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "permissionId" uuid NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "permissionId"`,
    );
  }
}
