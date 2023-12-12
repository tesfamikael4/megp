import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultForFundingSource1702295612697
  implements MigrationInterface
{
  name = 'SetDefaultForFundingSource1702295612697';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "tag"`);
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "fundingSource"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "fundingSource" text NOT NULL DEFAULT '[]'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "budget" DROP COLUMN "fundingSource"`);
    await queryRunner.query(
      `ALTER TABLE "budget" ADD "fundingSource" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "budget" ADD "tag" text NOT NULL`);
  }
}
