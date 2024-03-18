import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookmarkAdded1710600204273 implements MigrationInterface {
  name = 'BookmarkAdded1710600204273';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bid_bookmarks" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidderId" character varying NOT NULL, CONSTRAINT "UQ_da0d38e0dc6b4e7fc1538bb8f09" UNIQUE ("tenderId", "bidderId"), CONSTRAINT "PK_3235b03e8604ec822fd33114843" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_bookmarks" ADD CONSTRAINT "FK_7183a23d8b08073db9ec20e01f2" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_bookmarks" DROP CONSTRAINT "FK_7183a23d8b08073db9ec20e01f2"`,
    );
    await queryRunner.query(`DROP TABLE "bid_bookmarks"`);
  }
}
