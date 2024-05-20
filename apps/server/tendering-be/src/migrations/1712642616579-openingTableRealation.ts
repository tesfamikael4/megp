import { MigrationInterface, QueryRunner } from 'typeorm';

export class OpeningTableRealation1712642616579 implements MigrationInterface {
  name = 'OpeningTableRealation1712642616579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "teamId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "UQ_2134bf9ff08b1d831c9941ccc1c" UNIQUE ("teamId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_811664b9ff09cd3dc8ca4cf25bd" UNIQUE ("lotId")`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "openingType"`);
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "openingType" character varying NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "status" character varying NOT NULL DEFAULT 'PENDING'`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ALTER COLUMN "isReportReady" SET DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ADD CONSTRAINT "FK_2134bf9ff08b1d831c9941ccc1c" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "FK_2134bf9ff08b1d831c9941ccc1c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_6d1c8c7f705803f0711336a5c33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" ALTER COLUMN "isReportReady" DROP DEFAULT`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "status" text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "openingType"`);
    await queryRunner.query(
      `ALTER TABLE "openings" ADD "openingType" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_811664b9ff09cd3dc8ca4cf25bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "openings" DROP CONSTRAINT "UQ_2134bf9ff08b1d831c9941ccc1c"`,
    );
    await queryRunner.query(`ALTER TABLE "openings" DROP COLUMN "teamId"`);
  }
}
