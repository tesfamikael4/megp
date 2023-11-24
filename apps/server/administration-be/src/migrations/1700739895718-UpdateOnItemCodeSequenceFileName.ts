import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnItemCodeSequenceFileName1700739895718
  implements MigrationInterface
{
  name = 'UpdateOnItemCodeSequenceFileName1700739895718';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item_code_sequences" ("id" SERIAL NOT NULL, CONSTRAINT "PK_cc0ba05f678f7ec8580c2a6f802" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "item_code_sequences"`);
  }
}
