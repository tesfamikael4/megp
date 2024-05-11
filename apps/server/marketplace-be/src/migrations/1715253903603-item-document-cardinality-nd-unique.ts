import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemDocumentCardinalityNdUnique1715253903603
  implements MigrationInterface
{
  name = 'ItemDocumentCardinalityNdUnique1715253903603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT 'false'`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "FK_6fe75a765924c57e62a207b2b37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "UQ_f4977b96688db2a9e9d3662fedf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "UQ_6fe75a765924c57e62a207b2b37" UNIQUE ("rfxItemId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_qualifications" ADD CONSTRAINT "UQ_bc7efaaf14e2a55b4be68796278" UNIQUE ("rfxId", "order")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_qualifications" ADD CONSTRAINT "UQ_7821504bb771b2ae5b0742bf0ee" UNIQUE ("rfxId", "criteria")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ADD CONSTRAINT "UQ_3c5caa495cdb5e1af5d882250fb" UNIQUE ("rfxId", "order")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" ADD CONSTRAINT "UQ_69201d5b3d93c08df941d0fc243" UNIQUE ("rfxId", "documentTitle")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "UQ_f4977b96688db2a9e9d3662fedf" UNIQUE ("rfxItemId", "key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "FK_6fe75a765924c57e62a207b2b37" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "FK_6fe75a765924c57e62a207b2b37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "UQ_f4977b96688db2a9e9d3662fedf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" DROP CONSTRAINT "UQ_69201d5b3d93c08df941d0fc243"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_documentary_evidence" DROP CONSTRAINT "UQ_3c5caa495cdb5e1af5d882250fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_qualifications" DROP CONSTRAINT "UQ_7821504bb771b2ae5b0742bf0ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_qualifications" DROP CONSTRAINT "UQ_bc7efaaf14e2a55b4be68796278"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" DROP CONSTRAINT "UQ_6fe75a765924c57e62a207b2b37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "UQ_f4977b96688db2a9e9d3662fedf" UNIQUE ("rfxItemId", "key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_item_documents" ADD CONSTRAINT "FK_6fe75a765924c57e62a207b2b37" FOREIGN KEY ("rfxItemId") REFERENCES "rfx_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "isReverseAuction" SET DEFAULT false`,
    );
  }
}
