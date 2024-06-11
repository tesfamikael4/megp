import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamMember1717953112713 implements MigrationInterface {
  name = 'TeamMember1717953112713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "UQ_bf2095e35e662bae3af94e00bd0" UNIQUE ("rfxId", "personnelId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "UQ_bf2095e35e662bae3af94e00bd0"`,
    );
  }
}
