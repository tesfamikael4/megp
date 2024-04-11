import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenderTeamRelation1712824381811 implements MigrationInterface {
  name = 'TenderTeamRelation1712824381811';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones_trackers" DROP COLUMN "plannedEndDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones_trackers" DROP COLUMN "plannedStartDate"`,
    );
    await queryRunner.query(`ALTER TABLE "teams" ADD "tenderId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_8e58e477a19a1af7022ed0fcca8" UNIQUE ("tenderId", "teamType")`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_a6d97537359e3863e2baddc0014" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_a6d97537359e3863e2baddc0014"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_8e58e477a19a1af7022ed0fcca8"`,
    );
    await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "tenderId"`);
    await queryRunner.query(
      `ALTER TABLE "milestones_trackers" ADD "plannedStartDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones_trackers" ADD "plannedEndDate" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0" UNIQUE ("lotId", "teamType")`,
    );
  }
}
