import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReasonsUniqueConstraint1710223064892
  implements MigrationInterface
{
  name = 'ReasonsUniqueConstraint1710223064892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP COLUMN "ruleDesignerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD "designerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "UQ_de333f741602ac65257708c30d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803" UNIQUE ("key", "designerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "UQ_bb8cd8789b1ab55064e743b8765" UNIQUE ("reason", "designerId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_ed7b12726835d030e1976a7adad" FOREIGN KEY ("designerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_ed7b12726835d030e1976a7adad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "UQ_bb8cd8789b1ab55064e743b8765"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "UQ_de333f741602ac65257708c30d4" UNIQUE ("reason")`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP COLUMN "designerId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD "ruleDesignerId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_0f669cd17eabf7232c5466d8ecf" FOREIGN KEY ("ruleDesignerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
