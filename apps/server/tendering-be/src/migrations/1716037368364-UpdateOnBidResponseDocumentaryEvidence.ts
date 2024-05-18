import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBidResponseDocumentaryEvidence1716037368364
  implements MigrationInterface
{
  name = 'UpdateOnBidResponseDocumentaryEvidence1716037368364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP COLUMN "organizationName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP COLUMN "organizationId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD "organizationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD "organizationName" character varying NOT NULL`,
    );
  }
}
