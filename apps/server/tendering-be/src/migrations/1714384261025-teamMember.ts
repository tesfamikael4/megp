import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamMember1714384261025 implements MigrationInterface {
  name = 'TeamMember1714384261025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" DROP CONSTRAINT "FK_a27b7dd9fa26d06695693ec34e2"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessments" ADD CONSTRAINT "FK_a27b7dd9fa26d06695693ec34e2" FOREIGN KEY ("evaluatorId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
