import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidResponseDocuemnt1713307069409
  implements MigrationInterface
{
  name = 'UpdateOnBidResponseDocuemnt1713307069409';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP CONSTRAINT "UQ_33f2cf126bd641280e435d95ed3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP COLUMN "key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD CONSTRAINT "UQ_5d08807184d0486bf5cc5d0e360" UNIQUE ("bidRegistrationDetailId", "bidFormId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" DROP CONSTRAINT "UQ_5d08807184d0486bf5cc5d0e360"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD "key" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documents" ADD CONSTRAINT "UQ_33f2cf126bd641280e435d95ed3" UNIQUE ("bidRegistrationDetailId", "bidFormId", "key")`,
    );
  }
}
