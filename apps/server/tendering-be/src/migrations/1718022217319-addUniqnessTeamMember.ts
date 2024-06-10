import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqnessTeamMember1718022217319 implements MigrationInterface {
  name = 'AddUniqnessTeamMember1718022217319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "UQ_6895239c93cce6b2cb97157755e" UNIQUE ("teamId", "personnelId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "UQ_6895239c93cce6b2cb97157755e"`,
    );
  }
}
