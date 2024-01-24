import { MigrationInterface, QueryRunner } from 'typeorm';

export class RuleDesignerAdded1706018212461 implements MigrationInterface {
  name = 'RuleDesignerAdded1706018212461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "rule_handler_options" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "value" text, "dataType" character varying, "ruleHandlerId" uuid NOT NULL, CONSTRAINT "UQ_760b4a431a03d03258483a71f6e" UNIQUE ("key"), CONSTRAINT "PK_4397231ca90de1de988e361c75c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rule_handlers_type_enum" AS ENUM('CONDITION', 'ACTION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_handlers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "type" "public"."rule_handlers_type_enum" NOT NULL DEFAULT 'CONDITION', CONSTRAINT "UQ_bb4025654e5e4d4824b6eea3bf5" UNIQUE ("key"), CONSTRAINT "PK_c33fbf627657c5eb560ee7bc33b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rules" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "designerId" uuid NOT NULL, "executionOrder" integer NOT NULL, "conditions" jsonb NOT NULL, CONSTRAINT "UQ_59ada20b6a7bc62a73d0626dbdb" UNIQUE ("key"), CONSTRAINT "PK_10fef696a7d61140361b1b23608" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "possible_reasons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying NOT NULL, "ruleDesignerId" uuid NOT NULL, CONSTRAINT "UQ_de333f741602ac65257708c30d4" UNIQUE ("reason"), CONSTRAINT "PK_9691cc227d246e805dd3b033d90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rule_designer_enforcementmethod_enum" AS ENUM('MANDATORY', 'OPTIONAL', 'FLAG')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_designer" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "enforcementMethod" "public"."rule_designer_enforcementmethod_enum" NOT NULL DEFAULT 'OPTIONAL', "actions" jsonb NOT NULL, "defaultActions" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "UQ_382840e33f64ccf0fbf9a9f8e7f" UNIQUE ("key"), CONSTRAINT "PK_540b4b72c7641babdf0cfce539e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_handler_options" ADD CONSTRAINT "FK_e3228adb12575f5116c198c8b3c" FOREIGN KEY ("ruleHandlerId") REFERENCES "rule_handlers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "FK_15b285243d51705061f39df0a48" FOREIGN KEY ("designerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf" FOREIGN KEY ("ruleDesignerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "FK_15b285243d51705061f39df0a48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_handler_options" DROP CONSTRAINT "FK_e3228adb12575f5116c198c8b3c"`,
    );
    await queryRunner.query(`DROP TABLE "rule_designer"`);
    await queryRunner.query(
      `DROP TYPE "public"."rule_designer_enforcementmethod_enum"`,
    );
    await queryRunner.query(`DROP TABLE "possible_reasons"`);
    await queryRunner.query(`DROP TABLE "rules"`);
    await queryRunner.query(`DROP TABLE "rule_handlers"`);
    await queryRunner.query(`DROP TYPE "public"."rule_handlers_type_enum"`);
    await queryRunner.query(`DROP TABLE "rule_handler_options"`);
  }
}
