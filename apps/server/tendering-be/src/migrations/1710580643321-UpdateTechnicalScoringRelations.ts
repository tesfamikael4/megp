import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTechnicalScoringRelations1710580643321
  implements MigrationInterface
{
  name = 'UpdateTechnicalScoringRelations1710580643321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "REL_76e57cba6ff7dd3b57cc86cc7e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_960d4c5909b2a64d07602b18a2f" FOREIGN KEY ("parentId") REFERENCES "spd_technical_scoring"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed" FOREIGN KEY ("parentId") REFERENCES "eqc_technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_960d4c5909b2a64d07602b18a2f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "REL_76e57cba6ff7dd3b57cc86cc7e" UNIQUE ("parentId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed" FOREIGN KEY ("parentId") REFERENCES "eqc_technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
