import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initail1697579594710 implements MigrationInterface {
  name = 'Initail1697579594710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "security_question_news" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_13ef48d140bf0244d15013eebdf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" text NOT NULL, "password" text NOT NULL, "email" text NOT NULL, "firstName" text NOT NULL, "lastName" text NOT NULL, "phone" character varying, "status" text NOT NULL DEFAULT 'PENDING', "failedAttempts" integer NOT NULL DEFAULT '0', "bannedUntil" TIMESTAMP, CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username"), CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_verifications_status_enum" AS ENUM('NEW', 'USED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "account_verifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "otp" text NOT NULL, "status" "public"."account_verifications_status_enum" NOT NULL DEFAULT 'NEW', "type" character varying NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_2ba8bd9b1ff53fb582130c4c50c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "security_questions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_40863dac02e72e1ea928b07d5ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_profiles" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying, "region" character varying, "zoneOrSubCity" character varying, "city" character varying, "woreda" character varying, "street" character varying, "houseNumber" character varying, "mobileNumber" jsonb, "telephone" jsonb, "fax" jsonb, "postalCode" character varying, "profilePhoto" jsonb, "user_id" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_8481388d6325e752cd4d7e26c6" UNIQUE ("userId"), CONSTRAINT "PK_1ec6662219f4605723f1e41b6cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_mandates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "mandateId" uuid NOT NULL, "mandateName" character varying, "isSingleAssignment" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_597e3ca1f2b1ded22f9440bd330" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mandates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "key" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "versionNo" character varying NOT NULL DEFAULT true, "isSingleAssignment" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_08c57882cd87cc778f329700004" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mandate_permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mandateId" uuid NOT NULL, "permissionId" uuid NOT NULL, "applicationId" character varying NOT NULL, "applicationKey" character varying NOT NULL, "permissionKey" character varying NOT NULL, "permissionName" character varying, "applicationName" character varying, "seedManPerId" character varying, "organizationId" character varying, CONSTRAINT "PK_5352a812b315c760f80b0b7ca31" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "applications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "key" character varying NOT NULL, "organizationId" character varying NOT NULL, CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "key" character varying NOT NULL, "applicationId" uuid NOT NULL, "applicationKey" character varying NOT NULL, "applicationName" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, "permissionKey" character varying NOT NULL, "permissionName" character varying NOT NULL, "applicationId" character varying NOT NULL, "applicationKey" character varying NOT NULL, "applicationName" character varying NOT NULL, "seedRoleId" character varying, "seedRoleIdOrgId" character varying, "organizationId" character varying, CONSTRAINT "PK_84059017c90bfcb701b8fa42297" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "isSystemRole" boolean NOT NULL DEFAULT false, "key" character varying NOT NULL, "organizationId" character varying, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "roleId" uuid NOT NULL, "userId" uuid NOT NULL, "roleName" character varying NOT NULL, CONSTRAINT "PK_8acd5cf26ebd158416f477de799" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "group_news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "descriptionJson" jsonb, CONSTRAINT "PK_ecac7a768cea06d83f643e16858" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_group_news" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "groupId" uuid NOT NULL, CONSTRAINT "PK_195ea3debe289826f62f0146166" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "superTokenUserId" character varying NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying, "fullName" character varying, "phone" jsonb, "isLock" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "status" character varying NOT NULL DEFAULT 'DRAFT', "organizationId" uuid NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_units" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "unitId" uuid NOT NULL, "userId" uuid NOT NULL, "unitName" character varying NOT NULL, CONSTRAINT "PK_983d1f6d0181091e320d7c22fdc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "unit_types" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "organizationId" uuid, CONSTRAINT "PK_105c42fcf447c1da21fd20bcb85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "units" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "typeId" uuid, "code" character varying, "isActive" boolean NOT NULL DEFAULT true, "parentId" character varying, "organizationId" uuid NOT NULL, CONSTRAINT "PK_5a8f2f064919b587d93936cb223" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "offices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "location" character varying NOT NULL, "organizationId" uuid NOT NULL, CONSTRAINT "PK_1ea41502c6dddcec44ad9fcbbb3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_sectors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_d2c2e5ee1f501835dba41c4873f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_types" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, CONSTRAINT "PK_1e086602db2811aa43bfd5ff149" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organizations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "shortName" character varying, "description" character varying, "order" character varying, "type" character varying, "budgetType" character varying, "isActive" boolean NOT NULL DEFAULT false, "status" character varying NOT NULL DEFAULT 'DRAFT', "logo" jsonb, "address" jsonb, "typeId" uuid, "sectorId" uuid, "version" character varying NOT NULL DEFAULT '1.0.0-alpha', "isLocked" boolean NOT NULL DEFAULT false, "deactivateRemark" character varying, "deleteRemark" character varying, "taxIdentificationNumber" character varying, "externalOrganizationCode" character varying, CONSTRAINT "PK_6b031fcd0863e3f6b44230163f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_mandate_news" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organizationId" uuid NOT NULL, "mandateId" uuid NOT NULL, CONSTRAINT "PK_8e7a77b118692f3687af2c6f114" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mandate_news" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "key" character varying NOT NULL, "isActive" boolean NOT NULL, "versionNo" character varying NOT NULL, "isSingleAssignment" boolean NOT NULL, CONSTRAINT "PK_8a72c537398d686f652952e812e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mandate_permission_news" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "mandateId" uuid NOT NULL, "permissionId" uuid NOT NULL, "applicationId" character varying NOT NULL, "applicationKey" character varying NOT NULL, "permissionKey" character varying NOT NULL, CONSTRAINT "PK_c15289ab056408e345ddeab8996" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission_news" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "applicationId" uuid NOT NULL, CONSTRAINT "PK_9badad832f5314edb9e89448ae8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "application_news" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_51d87aa9ce219c8d88f8b0c8968" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "demos" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying, "key" character varying NOT NULL, "organizationId" character varying NOT NULL, CONSTRAINT "PK_a0918b73a3bd78c313e0e085f5c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_new" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "superTokenUserId" character varying NOT NULL, "username" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying, "phone" character varying, "status" character varying NOT NULL DEFAULT 'DRAFT', CONSTRAINT "PK_3b7c96b1a76ffade0f851e455fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "security_questions_new" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "question" character varying NOT NULL, "answer" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_8f1ce608a472b9190c6e9558fea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "failedAttempts"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "bannedUntil"`);
    await queryRunner.query(
      `ALTER TABLE "account_verifications" DROP COLUMN "type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "failedAttempts" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "bannedUntil" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ADD "status" text NOT NULL DEFAULT 'NEW'`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_question_news" ADD CONSTRAINT "FK_2bb22c806ad44815f1acd374c7b" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ADD CONSTRAINT "FK_f6a7880564a7ddaecb217fd0a2d" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questions" ADD CONSTRAINT "FK_fc31b5460e57c3607cc78021f5e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_profiles" ADD CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_e69a6b95b51c7ca82c2d3f8d608" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandates" ADD CONSTRAINT "FK_413c26de3e7f761c522d090e67d" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_03cec89946eb06d9ca53571f265" FOREIGN KEY ("mandateId") REFERENCES "mandates"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permissions" ADD CONSTRAINT "FK_ee37ce2a84baabd8d1693a445be" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_74397bdb994521e4a73747a8499" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group_news" ADD CONSTRAINT "FK_63224e8c77bbaff5050ba224ca8" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group_news" ADD CONSTRAINT "FK_a89dad95a66377762b60bdff3e2" FOREIGN KEY ("groupId") REFERENCES "group_news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_eb5a24b37234fad2ed645d97b5e" FOREIGN KEY ("unitId") REFERENCES "units"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_units" ADD CONSTRAINT "FK_b31c5490ab8f851d1a5e56eed3a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_types" ADD CONSTRAINT "FK_c1a2c2ab589601df996063661d2" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_b5b8cd84ab78d99783a0aeafba1" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_eee0907c9271e01e416482b3528" FOREIGN KEY ("typeId") REFERENCES "unit_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "offices" ADD CONSTRAINT "FK_9a071164d924633e301e02b2abd" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c" FOREIGN KEY ("typeId") REFERENCES "organization_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD CONSTRAINT "FK_a52d43c334271a4e8d1752158ea" FOREIGN KEY ("sectorId") REFERENCES "organization_sectors"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandate_news" ADD CONSTRAINT "FK_e7cabd359ad910c188d1afe0219" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandate_news" ADD CONSTRAINT "FK_dfb4ad4e60a9d8374fb4d17158d" FOREIGN KEY ("mandateId") REFERENCES "mandate_news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permission_news" ADD CONSTRAINT "FK_c3e710d2eb530c1356cdd4845cc" FOREIGN KEY ("mandateId") REFERENCES "mandate_news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permission_news" ADD CONSTRAINT "FK_f3d62d6dc11d2ef7d142ef2ce7a" FOREIGN KEY ("permissionId") REFERENCES "permission_news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_news" ADD CONSTRAINT "FK_bbddf8a885e57ee8d8b98b3e695" FOREIGN KEY ("applicationId") REFERENCES "application_news"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questions_new" ADD CONSTRAINT "FK_9bd8178e5c4e988f4137c74a03c" FOREIGN KEY ("userId") REFERENCES "users_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "security_questions_new" DROP CONSTRAINT "FK_9bd8178e5c4e988f4137c74a03c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission_news" DROP CONSTRAINT "FK_bbddf8a885e57ee8d8b98b3e695"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permission_news" DROP CONSTRAINT "FK_f3d62d6dc11d2ef7d142ef2ce7a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mandate_permission_news" DROP CONSTRAINT "FK_c3e710d2eb530c1356cdd4845cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandate_news" DROP CONSTRAINT "FK_dfb4ad4e60a9d8374fb4d17158d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_mandate_news" DROP CONSTRAINT "FK_e7cabd359ad910c188d1afe0219"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_a52d43c334271a4e8d1752158ea"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP CONSTRAINT "FK_ecea9e8e98c195dbcdcfa59d60c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "offices" DROP CONSTRAINT "FK_9a071164d924633e301e02b2abd"`,
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
      `ALTER TABLE "users" DROP CONSTRAINT "FK_f3d6aea8fcca58182b2e80ce979"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group_news" DROP CONSTRAINT "FK_a89dad95a66377762b60bdff3e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_group_news" DROP CONSTRAINT "FK_63224e8c77bbaff5050ba224ca8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_74397bdb994521e4a73747a8499"`,
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
      `ALTER TABLE "user_profiles" DROP CONSTRAINT "FK_8481388d6325e752cd4d7e26c6d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_questions" DROP CONSTRAINT "FK_fc31b5460e57c3607cc78021f5e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" DROP CONSTRAINT "FK_f6a7880564a7ddaecb217fd0a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "security_question_news" DROP CONSTRAINT "FK_2bb22c806ad44815f1acd374c7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ADD "status" "public"."account_verifications_status_enum" NOT NULL DEFAULT 'NEW'`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE ("username")`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" DROP COLUMN "type"`,
    );
    await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "bannedUntil"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP COLUMN "failedAttempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_verifications" ADD "type" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "bannedUntil" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD "failedAttempts" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "security_questions_new"`);
    await queryRunner.query(`DROP TABLE "users_new"`);
    await queryRunner.query(`DROP TABLE "demos"`);
    await queryRunner.query(`DROP TABLE "application_news"`);
    await queryRunner.query(`DROP TABLE "permission_news"`);
    await queryRunner.query(`DROP TABLE "mandate_permission_news"`);
    await queryRunner.query(`DROP TABLE "mandate_news"`);
    await queryRunner.query(`DROP TABLE "organization_mandate_news"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
    await queryRunner.query(`DROP TABLE "organization_types"`);
    await queryRunner.query(`DROP TABLE "organization_sectors"`);
    await queryRunner.query(`DROP TABLE "offices"`);
    await queryRunner.query(`DROP TABLE "units"`);
    await queryRunner.query(`DROP TABLE "unit_types"`);
    await queryRunner.query(`DROP TABLE "user_units"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "user_group_news"`);
    await queryRunner.query(`DROP TABLE "group_news"`);
    await queryRunner.query(`DROP TABLE "user_roles"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "role_permissions"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "applications"`);
    await queryRunner.query(`DROP TABLE "mandate_permissions"`);
    await queryRunner.query(`DROP TABLE "mandates"`);
    await queryRunner.query(`DROP TABLE "organization_mandates"`);
    await queryRunner.query(`DROP TABLE "user_profiles"`);
    await queryRunner.query(`DROP TABLE "security_questions"`);
    await queryRunner.query(`DROP TABLE "account_verifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."account_verifications_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TABLE "security_question_news"`);
  }
}
