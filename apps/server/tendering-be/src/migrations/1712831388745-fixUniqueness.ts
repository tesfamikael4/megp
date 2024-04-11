import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUniqueness1712831388745 implements MigrationInterface {
  name = 'FixUniqueness1712831388745';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_8e58e477a19a1af7022ed0fcca8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0" UNIQUE ("lotId", "teamType")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "teams" DROP CONSTRAINT "UQ_0e0f1ddb4f2fdb3b64ca3a41fe0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "teams" ADD CONSTRAINT "UQ_8e58e477a19a1af7022ed0fcca8" UNIQUE ("teamType", "tenderId")`,
    );
  }
}
