import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnSystemRole1702041187961 implements MigrationInterface {
  name = 'UpdateOnSystemRole1702041187961';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "UQ_1d0cca5988f8de7db1981b04ae4" UNIQUE ("roleSystemId", "permissionId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" DROP CONSTRAINT "UQ_1d0cca5988f8de7db1981b04ae4"`,
    );
  }
}
