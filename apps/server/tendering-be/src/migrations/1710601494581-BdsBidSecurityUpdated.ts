import { MigrationInterface, QueryRunner } from 'typeorm';

export class BdsBidSecurityUpdated1710601494581 implements MigrationInterface {
  name = 'BdsBidSecurityUpdated1710601494581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bds_bid_securities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "bidSecurityRequired" boolean NOT NULL, "bidSecurityAmount" integer, "bidSecurityCurrency" character varying, "bidSecurityForm" character varying NOT NULL, CONSTRAINT "PK_8fd567a4860c3c7311ada52bc4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" ADD CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_bid_securities" DROP CONSTRAINT "FK_f74f982a3d5a91345ea8fd96865"`,
    );
    await queryRunner.query(`DROP TABLE "bds_bid_securities"`);
  }
}
