import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePermissinTypeToString1711763895157
  implements MigrationInterface
{
  name = 'ChangePermissinTypeToString1711763895157';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "permissionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "permissionId" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP COLUMN "permissionId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD "permissionId" uuid NOT NULL`,
    );
  }
}
