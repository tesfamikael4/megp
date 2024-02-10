import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreferentialTreatmentEntityUpdate1705319353385
  implements MigrationInterface
{
  name = 'PreferentialTreatmentEntityUpdate1705319353385';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "attachments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "userId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "certificateUrl" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "otherDocuments" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "otherDocuments"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "certificateUrl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preferential_treatments" ADD "attachments" jsonb`,
    );
  }
}
