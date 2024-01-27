import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initail1706343126089 implements MigrationInterface {
  name = 'Initail1706343126089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "security_questions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_40863dac02e72e1ea928b07d5ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL DEFAULT 'DRAFT', "organizationId" uuid NOT NULL, "accountId" uuid, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "extendedProfile" jsonb NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "REL_a280745fc3975bd18695ae8dde" UNIQUE ("accountId"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_status_enum" AS ENUM('PENDING', 'ACTIVE', 'INACTIVE', 'DISABLED', 'INVITED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" text NOT NULL, "password" text, "email" text NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "phone" character varying, "status" "public"."accounts_status_enum" NOT NULL DEFAULT 'PENDING', "failedAttempts" integer NOT NULL DEFAULT '0', "bannedUntil" TIMESTAMP, CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username"), CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_verifications_status_enum" AS ENUM('NEW', 'USED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_verifications_otptype_enum" AS ENUM('EMAIL_VERIFICATION', 'RESET_PASSWORD', 'PHONE_VERIFICATION', 'INVITATION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "account_verifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otp" text NOT NULL, "status" "public"."account_verifications_status_enum" NOT NULL DEFAULT 'NEW', "otpType" "public"."account_verifications_otptype_enum" NOT NULL DEFAULT 'EMAIL_VERIFICATION', "accountId" uuid NOT NULL, "userId" text, CONSTRAINT "PK_2ba8bd9b1ff53fb582130c4c50c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "key" character varying NOT NULL, "applicationId" integer NOT NULL, CONSTRAINT "UQ_017943867ed5ceef9c03edd9745" UNIQUE ("key"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "applications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "key" character varying NOT NULL, CONSTRAINT "UQ_5de0f110aed03277d8d7b2e5a89" UNIQUE ("key"), CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_groups" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_ea7760dc75ee1bf0b09ab9b3289" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "groups" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "organizationId" uuid, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_mandates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "mandateId" integer NOT NULL, CONSTRAINT "PK_597e3ca1f2b1ded22f9440bd330" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mandates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "key" character varying NOT NULL, "isActive" boolean NOT NULL, "versionNo" character varying NOT NULL, "isSingleAssignment" boolean NOT NULL, CONSTRAINT "PK_08c57882cd87cc778f329700004" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mandate_permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mandateId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_5352a812b315c760f80b0b7ca31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_units" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_983d1f6d0181091e320d7c22fdc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "unit_types" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "organizationId" uuid, CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "units" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying, "shortName" character varying, "description" character varying, "status" character varying NOT NULL DEFAULT 'DRAFT', "logo" jsonb, "address" jsonb, "typeId" uuid, "parentId" character varying, "organizationId" uuid NOT NULL, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "UQ_d430a02aad006d8a70f3acd7d03" UNIQUE ("roleId", "permissionId"), CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "isSystemRole" boolean NOT NULL DEFAULT false, "organizationId" uuid NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "shortName" character varying NOT NULL, "description" character varying, "type" character varying, "status" character varying NOT NULL DEFAULT 'DRAFT', "logo" jsonb, "address" jsonb, "typeId" uuid, CONSTRAINT "UQ_7e27c3b62c681fbe3e2322535f2" UNIQUE ("code"), CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_types" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_1e086602db2811aa43bfd5ff149" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_system_permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleSystemId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "UQ_1d0cca5988f8de7db1981b04ae4" UNIQUE ("roleSystemId", "permissionId"), CONSTRAINT "PK_5b10967385d435ad5ed8ecd2b48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role_systems" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleSystemId" integer NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_43f6551d996a3b68d873e5200a2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_systems" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" integer NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "key" character varying NOT NULL, CONSTRAINT "UQ_5f521a130fe7397aea98f049973" UNIQUE ("key"), CONSTRAINT "PK_7cce3f25fddcc15aef1ae4298d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questions" ADD CONSTRAINT "FK_9d52a346395912db63f87a519f7" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_a280745fc3975bd18695ae8dde2" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ADD CONSTRAINT "FK_f6a7880564a7ddaecb217fd0a2d" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_74397bdb994521e4a73747a8499" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_groups" ADD CONSTRAINT "FK_99d01ff7f143377c044f3d6c955" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_groups" ADD CONSTRAINT "FK_4dcea3f5c6f04650517d9dc4750" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ADD CONSTRAINT "FK_76b7c20054f6c4c89fe317273d1" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_e69a6b95b51c7ca82c2d3f8d608" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_413c26de3e7f761c522d090e67d" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE CASCADE ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_03cec89946eb06d9ca53571f265" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_ee37ce2a84baabd8d1693a445be" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_b31c5490ab8f851d1a5e56eed3a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_types" ADD CONSTRAINT "FK_c1a2c2ab589601df996063661d2" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_b5b8cd84ab78d99783a0aeafba1" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_eee0907c9271e01e416482b3528" FOREIGN KEY ("typeId") REFERENCES "unit_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" ADD CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c" FOREIGN KEY ("typeId") REFERENCES "organization_types"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_dc5aea8f63adb6011439166a9f5" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_system_permissions" ADD CONSTRAINT "FK_55b47311de22e78590e15e120bd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_f8d905c1bf8618ad7764a509df7" FOREIGN KEY ("roleSystemId") REFERENCES "role_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role_systems" ADD CONSTRAINT "FK_0e8a8bb517a263f399ba27ab598" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
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
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles" DROP CONSTRAINT "FK_0933e1dfb2993d672af1a98f08e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "FK_eee0907c9271e01e416482b3528"`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" DROP CONSTRAINT "FK_b5b8cd84ab78d99783a0aeafba1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_types" DROP CONSTRAINT "FK_c1a2c2ab589601df996063661d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_b31c5490ab8f851d1a5e56eed3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" DROP CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" DROP CONSTRAINT "FK_ee37ce2a84baabd8d1693a445be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" DROP CONSTRAINT "FK_03cec89946eb06d9ca53571f265"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" DROP CONSTRAINT "FK_413c26de3e7f761c522d090e67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" DROP CONSTRAINT "FK_e69a6b95b51c7ca82c2d3f8d608"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" DROP CONSTRAINT "FK_76b7c20054f6c4c89fe317273d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_groups" DROP CONSTRAINT "FK_4dcea3f5c6f04650517d9dc4750"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_groups" DROP CONSTRAINT "FK_99d01ff7f143377c044f3d6c955"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_74397bdb994521e4a73747a8499"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" DROP CONSTRAINT "FK_f6a7880564a7ddaecb217fd0a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_a280745fc3975bd18695ae8dde2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questions" DROP CONSTRAINT "FK_9d52a346395912db63f87a519f7"`,
    );
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "role_systems"`);
    await queryRunner.query(`DROP TABLE "user_role_systems"`);
    await queryRunner.query(`DROP TABLE "role_system_permissions"`);
    await queryRunner.query(`DROP TABLE "organization_types"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "units"`);
    await queryRunner.query(`DROP TABLE "unit_types"`);
    await queryRunner.query(`DROP TABLE "user_units"`);
    await queryRunner.query(`DROP TABLE "mandate_permissions"`);
    await queryRunner.query(`DROP TABLE "mandates"`);
    await queryRunner.query(`DROP TABLE "organization_mandates"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP TABLE "user_groups"`);
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "account_verifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."account_verifications_otptype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."account_verifications_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TYPE "public"."accounts_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "security_questions"`);
  }
}
