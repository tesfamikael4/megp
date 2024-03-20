import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserNameAddedOnPTT1710916175255 implements MigrationInterface {
  name = 'UserNameAddedOnPTT1710916175255';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_technical_teams" ADD "userName" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procurement_technical_teams" DROP COLUMN "userName"`,
    );
  }
}
