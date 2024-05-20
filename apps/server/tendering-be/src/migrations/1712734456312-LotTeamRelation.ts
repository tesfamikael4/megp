import { MigrationInterface, QueryRunner } from 'typeorm';

export class LotTeamRelation1712734456312 implements MigrationInterface {
  name = 'LotTeamRelation1712734456312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_811664b9ff09cd3dc8ca4cf25bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0" UNIQUE ("lotId", "teamType")`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_811664b9ff09cd3dc8ca4cf25bd" UNIQUE ("lotId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "FK_811664b9ff09cd3dc8ca4cf25bd" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
