import { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleKeyUnique1702023103263 implements MigrationInterface {
  name = 'RoleKeyUnique1702023103263';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "UQ_d430a02aad006d8a70f3acd7d03" UNIQUE ("roleId", "permissionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "UQ_c63f25e362340df593c13fb1525" UNIQUE ("key", "organizationId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "UQ_c63f25e362340df593c13fb1525"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "UQ_d430a02aad006d8a70f3acd7d03"`,
    );
  }
}
