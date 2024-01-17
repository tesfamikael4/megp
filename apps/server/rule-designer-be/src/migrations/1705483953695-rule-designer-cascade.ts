import { MigrationInterface, QueryRunner } from 'typeorm';

export class RuleDesignerCascade1705483953695 implements MigrationInterface {
  name = 'RuleDesignerCascade1705483953695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "FK_15b285243d51705061f39df0a48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "FK_15b285243d51705061f39df0a48" FOREIGN KEY ("designerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "FK_15b285243d51705061f39df0a48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "FK_15b285243d51705061f39df0a48" FOREIGN KEY ("designerId") REFERENCES "rule_designer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
