import { MigrationInterface, QueryRunner } from 'typeorm';

export class RuleReasonCascade1705497097954 implements MigrationInterface {
  name = 'RuleReasonCascade1705497097954';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf"`,
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
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf" FOREIGN KEY ("ruleDesignerId") REFERENCES "rule_designer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
