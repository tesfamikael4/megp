import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderEntity1714577714417 implements MigrationInterface {
  name = 'UpdateOnTenderEntity1714577714417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "tenderInvitation" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP COLUMN "tenderInvitation"`,
    );
  }
}
