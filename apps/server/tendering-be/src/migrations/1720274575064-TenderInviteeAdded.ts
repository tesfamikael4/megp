import { MigrationInterface, QueryRunner } from 'typeorm';

export class TenderInviteeAdded1720274575064 implements MigrationInterface {
  name = 'TenderInviteeAdded1720274575064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tender_invitees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidderId" character varying NOT NULL, "bidderName" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_5922c425d327ae7e5ddbf4ca817" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_invitees" ADD CONSTRAINT "FK_00fc1f4500c79ef01336ce37741" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_invitees" DROP CONSTRAINT "FK_00fc1f4500c79ef01336ce37741"`,
    );
    await queryRunner.query(`DROP TABLE "tender_invitees"`);
  }
}
