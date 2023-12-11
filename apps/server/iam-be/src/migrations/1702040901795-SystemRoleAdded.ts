import { MigrationInterface, QueryRunner } from 'typeorm';

export class SystemRoleAdded1702040901795 implements MigrationInterface {
  name = 'SystemRoleAdded1702040901795';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role_system_permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleSystemId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_5b10967385d435ad5ed8ecd2b48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role_systems" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleSystemId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_43f6551d996a3b68d873e5200a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_systems" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "key" character varying NOT NULL, CONSTRAINT "UQ_5f521a130fe7397aea98f049973" UNIQUE ("key"), CONSTRAINT "PK_7cce3f25fddcc15aef1ae4298d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_dc5aea8f63adb6011439166a9f5" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_55b47311de22e78590e15e120bd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_0e8a8bb517a263f399ba27ab598" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_0e8a8bb517a263f399ba27ab598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" DROP CONSTRAINT "FK_55b47311de22e78590e15e120bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" DROP CONSTRAINT "FK_dc5aea8f63adb6011439166a9f5"`,
    );
    await queryRunner.query(`DROP TABLE "role_systems"`);
    await queryRunner.query(`DROP TABLE "user_role_systems"`);
    await queryRunner.query(`DROP TABLE "role_system_permissions"`);
  }
}
