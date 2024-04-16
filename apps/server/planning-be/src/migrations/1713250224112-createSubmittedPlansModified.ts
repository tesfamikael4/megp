import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubmittedPlansModified1713250224112
  implements MigrationInterface
{
  name = 'CreateSubmittedPlansModified1713250224112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submitted_plans" ADD "objectId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "submitted_plans" ADD "version" integer NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submitted_plans" DROP COLUMN "version"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submitted_plans" DROP COLUMN "objectId"`,
    );
  }
}
