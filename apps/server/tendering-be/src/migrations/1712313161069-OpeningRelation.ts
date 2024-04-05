import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpeningRelation1712313161069 implements MigrationInterface {
  name = 'OpeningRelation1712313161069';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "lotId"`);
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "UQ_898061552c1476d5a0a8cc65980" UNIQUE ("tenderId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "FK_898061552c1476d5a0a8cc65980" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "FK_898061552c1476d5a0a8cc65980"`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "UQ_898061552c1476d5a0a8cc65980"`,
    );
    await queryRunner.query(`ALTER TABLE "openings" ADD "lotId" uuid NOT NULL`);
  }
}
