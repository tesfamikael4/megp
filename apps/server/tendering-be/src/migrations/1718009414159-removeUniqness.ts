import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUniqness1718009414159 implements MigrationInterface {
  name = 'RemoveUniqness1718009414159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "FK_2134bf9ff08b1d831c9941ccc1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "FK_898061552c1476d5a0a8cc65980"`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "UQ_2134bf9ff08b1d831c9941ccc1c"`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "teamId"`);
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "UQ_898061552c1476d5a0a8cc65980"`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "tenderId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "tenderId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "UQ_898061552c1476d5a0a8cc65980" UNIQUE ("tenderId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "teamId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "UQ_2134bf9ff08b1d831c9941ccc1c" UNIQUE ("teamId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "FK_898061552c1476d5a0a8cc65980" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "FK_2134bf9ff08b1d831c9941ccc1c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
