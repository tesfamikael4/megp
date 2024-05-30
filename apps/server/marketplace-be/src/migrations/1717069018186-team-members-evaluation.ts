import { MigrationInterface, QueryRunner } from 'typeorm';

export class TeamMembersEvaluation1717069018186 implements MigrationInterface {
  name = 'TeamMembersEvaluation1717069018186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_6e176d714741e60ef3df8d406e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_b20c2b899ef68805678381ae2c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "UQ_ff4861e95ce62590529087a9c1e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "UQ_1c7ce4673c77fe9a8c0d0b3a458"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "UQ_438d273ae6903848e3254e73e3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "UQ_0e9f1e07ee8418bfb1f8b201756"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" RENAME COLUMN "key" TO "rfxDocumentaryEvidenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" RENAME COLUMN "key" TO "rfxDocumentaryEvidenceId"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eval_assessments_qualified_enum" AS ENUM('COMPLY', 'NOT_COMPLY', 'NOT_APPLICABLE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eval_assessments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isTeamAssesment" boolean NOT NULL DEFAULT false, "qualified" "public"."eval_assessments_qualified_enum" NOT NULL, "remark" character varying, "teamMemberId" uuid NOT NULL, "rfxId" uuid NOT NULL, "solRegistrationId" uuid NOT NULL, CONSTRAINT "UQ_a199656f52afeb8f2c448739286" UNIQUE ("teamMemberId", "rfxId", "isTeamAssesment"), CONSTRAINT "PK_e932a1600a84ea11e2ba6bd9569" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "team_members" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "personnelId" uuid NOT NULL, "personnelName" character varying NOT NULL, "isTeamLead" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL, "rfxId" uuid NOT NULL, CONSTRAINT "PK_ca3eae89dcf20c9fd95bf7460aa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP COLUMN "evaluatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP COLUMN "evaluatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD "openedItemResponseId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD "teamMemberId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD "openedResponseId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD "teamMemberId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD "rfxDocumentaryEvidenceId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP COLUMN "rfxDocumentaryEvidenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD "rfxDocumentaryEvidenceId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP COLUMN "rfxDocumentaryEvidenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD "rfxDocumentaryEvidenceId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_1ed87ed4fa2ee98a1be15c0a5e9" UNIQUE ("key", "itemId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "UQ_725ae8eb4a712a89bea4b993ebd" UNIQUE ("teamMemberId", "rfxProductInvitaitonId", "isTeamAssesment")`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "UQ_f4f8326b3f0492bc85b5b8e5d36" UNIQUE ("rfxId", "vendorId", "rfxDocumentaryEvidenceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "UQ_e7cfffa8c85c4693bfd5998d398" UNIQUE ("rfxId", "vendorId", "rfxDocumentaryEvidenceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "UQ_9542d01ba389b1c114085c6f3fe" UNIQUE ("teamMemberId", "rfxId", "isTeamAssesment", "openedResponseId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "FK_5b12a455472faae7d138529571a" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "FK_0c5755fc514cb4513b675a4d3b3" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" ADD CONSTRAINT "FK_81f2281803f41932c17823f02d9" FOREIGN KEY ("solRegistrationId") REFERENCES "sol_registration"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_b29c3a490e8523e158f6da6788e" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_57614f292ebb2958b30cdd265a5" FOREIGN KEY ("openedItemResponseId") REFERENCES "opened_response_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "FK_35ebc892ffea1fb386251b8d4d9" FOREIGN KEY ("rfxDocumentaryEvidenceId") REFERENCES "rfx_documentary_evidence"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "FK_365396326b40948d08476949d57" FOREIGN KEY ("rfxDocumentaryEvidenceId") REFERENCES "rfx_documentary_evidence"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_bb6776c0ebce80533ccf9bd22d5" FOREIGN KEY ("rfxDocumentaryEvidenceId") REFERENCES "rfx_documentary_evidence"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_549f9635a68512ffa189fcead71" FOREIGN KEY ("teamMemberId") REFERENCES "team_members"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_406e761938ea6ba9ab61d3960d5" FOREIGN KEY ("openedResponseId") REFERENCES "opened_responses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "team_members" ADD CONSTRAINT "FK_5b7e581ef8f6b3eeda3b00fa2cf" FOREIGN KEY ("rfxId") REFERENCES "rfxs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "team_members" DROP CONSTRAINT "FK_5b7e581ef8f6b3eeda3b00fa2cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_406e761938ea6ba9ab61d3960d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_549f9635a68512ffa189fcead71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "FK_bb6776c0ebce80533ccf9bd22d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "FK_365396326b40948d08476949d57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "FK_35ebc892ffea1fb386251b8d4d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_57614f292ebb2958b30cdd265a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "FK_b29c3a490e8523e158f6da6788e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "FK_81f2281803f41932c17823f02d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "FK_0c5755fc514cb4513b675a4d3b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_assessments" DROP CONSTRAINT "FK_5b12a455472faae7d138529571a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP CONSTRAINT "UQ_9542d01ba389b1c114085c6f3fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP CONSTRAINT "UQ_e7cfffa8c85c4693bfd5998d398"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP CONSTRAINT "UQ_f4f8326b3f0492bc85b5b8e5d36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP CONSTRAINT "UQ_725ae8eb4a712a89bea4b993ebd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_1ed87ed4fa2ee98a1be15c0a5e9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" DROP COLUMN "rfxDocumentaryEvidenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD "rfxDocumentaryEvidenceId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" DROP COLUMN "rfxDocumentaryEvidenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD "rfxDocumentaryEvidenceId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP COLUMN "rfxDocumentaryEvidenceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP COLUMN "teamMemberId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" DROP COLUMN "openedResponseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP COLUMN "teamMemberId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" DROP COLUMN "openedItemResponseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD "evaluatorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD "evaluatorId" uuid NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "team_members"`);
    await queryRunner.query(`DROP TABLE "eval_assessments"`);
    await queryRunner.query(
      `DROP TYPE "public"."eval_assessments_qualified_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" RENAME COLUMN "rfxDocumentaryEvidenceId" TO "key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" RENAME COLUMN "rfxDocumentaryEvidenceId" TO "key"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "UQ_0e9f1e07ee8418bfb1f8b201756" UNIQUE ("evaluatorId", "rfxId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_responses" ADD CONSTRAINT "UQ_438d273ae6903848e3254e73e3a" UNIQUE ("rfxId", "vendorId", "key")`,
    );
    await queryRunner.query(
      `ALTER TABLE "opened_responses" ADD CONSTRAINT "UQ_1c7ce4673c77fe9a8c0d0b3a458" UNIQUE ("vendorId", "key", "rfxId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "UQ_ff4861e95ce62590529087a9c1e" UNIQUE ("rfxProductInvitaitonId", "evaluatorId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_responses" ADD CONSTRAINT "FK_b20c2b899ef68805678381ae2c9" FOREIGN KEY ("evaluatorId") REFERENCES "rfx_procurement_technical_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eval_item_responses" ADD CONSTRAINT "FK_6e176d714741e60ef3df8d406e0" FOREIGN KEY ("evaluatorId") REFERENCES "rfx_procurement_technical_teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
