import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVoteCode1713403808336 implements MigrationInterface {
  name = 'AddVoteCode1713403808336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "budgetCheckNeeded" boolean DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" ADD "voteCode" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "voteCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organizations" DROP COLUMN "budgetCheckNeeded"`,
    );
  }
}
