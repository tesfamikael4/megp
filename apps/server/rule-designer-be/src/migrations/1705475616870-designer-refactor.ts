import { MigrationInterface, QueryRunner } from 'typeorm';

export class DesignerRefactor1705475616870 implements MigrationInterface {
  name = 'DesignerRefactor1705475616870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_707c2ee534e373b9cf0f1ef30f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" RENAME COLUMN "ruleId" TO "ruleDesignerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" DROP COLUMN "enforcementMethod"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rules_enforcementmethod_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "rules" DROP COLUMN "actions"`);
    await queryRunner.query(
      `CREATE TYPE "public"."rule_designer_enforcementmethod_enum" AS ENUM('MANDATORY', 'OPTIONAL', 'FLAG')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_designer" ADD "enforcementMethod" "public"."rule_designer_enforcementmethod_enum" NOT NULL DEFAULT 'OPTIONAL'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_designer" ADD "actions" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf" FOREIGN KEY ("ruleDesignerId") REFERENCES "rule_designer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_designer" DROP COLUMN "actions"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_designer" DROP COLUMN "enforcementMethod"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."rule_designer_enforcementmethod_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "rules" ADD "actions" jsonb NOT NULL`);
    await queryRunner.query(
      `CREATE TYPE "public"."rules_enforcementmethod_enum" AS ENUM('MANDATORY', 'OPTIONAL', 'FLAG')`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD "enforcementMethod" "public"."rules_enforcementmethod_enum" NOT NULL DEFAULT 'OPTIONAL'`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" RENAME COLUMN "ruleDesignerId" TO "ruleId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_707c2ee534e373b9cf0f1ef30f4" FOREIGN KEY ("ruleId") REFERENCES "rules"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
