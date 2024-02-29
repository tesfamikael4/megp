import { MigrationInterface, QueryRunner } from 'typeorm';

export class StatusCases1709209094577 implements MigrationInterface {
  name = 'StatusCases1709209094577';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "FK_eee0907c9271e01e416482b3528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."users_status_enum" AS ENUM('Pending', 'Inactive', 'Active')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" "public"."users_status_enum" NOT NULL DEFAULT 'Inactive'`,
    );
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."organizations_status_enum" AS ENUM('Inactive', 'Active')`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "status" "public"."organizations_status_enum" NOT NULL DEFAULT 'Inactive'`,
    );
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "status"`);
    await queryRunner.query(
      `CREATE TYPE "public"."units_status_enum" AS ENUM('Inactive', 'Active')`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD "status" "public"."units_status_enum" NOT NULL DEFAULT 'Inactive'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_eee0907c9271e01e416482b3528" FOREIGN KEY ("typeId") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "FK_eee0907c9271e01e416482b3528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" DROP CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."units_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "units" ADD "status" character varying NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."organizations_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "status" character varying NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "status" character varying NOT NULL DEFAULT 'DRAFT'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_eee0907c9271e01e416482b3528" FOREIGN KEY ("typeId") REFERENCES "unit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
