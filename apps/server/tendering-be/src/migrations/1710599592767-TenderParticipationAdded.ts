import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenderParticipationAdded1710599592767
  implements MigrationInterface
{
  name = 'TenderParticipationAdded1710599592767';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tender_participation_fees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character varying NOT NULL, "method" character varying NOT NULL, CONSTRAINT "REL_bb8523ce3a8e3441e0642278dd" UNIQUE ("tenderId"), CONSTRAINT "PK_29d8df4b5e1ccddf8203816d302" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_classifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "classification" jsonb NOT NULL, CONSTRAINT "PK_5c8e095ea8c8516a4370da8ea44" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" ADD "procurementCategory" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" ADD CONSTRAINT "FK_bb8523ce3a8e3441e0642278dd7" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" ADD CONSTRAINT "FK_0a45e81c8e5f421b80ee4498130" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" DROP CONSTRAINT "FK_0a45e81c8e5f421b80ee4498130"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" DROP CONSTRAINT "FK_bb8523ce3a8e3441e0642278dd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenders" DROP COLUMN "procurementCategory"`,
    );
    await queryRunner.query(`DROP TABLE "tender_classifications"`);
    await queryRunner.query(`DROP TABLE "tender_participation_fees"`);
  }
}
