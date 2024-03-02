import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnBdsGeneralAndMore1709377559622
  implements MigrationInterface
{
  name = 'UpdateOnBdsGeneralAndMore1709377559622';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP CONSTRAINT "FK_bc11ee765c17805cac6e3b2a952"`,
    );
    await queryRunner.query(
      `CREATE TABLE "tender_spds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "spdId" uuid NOT NULL, CONSTRAINT "REL_0d09038a7c2856a68c38b8a9ff" UNIQUE ("tenderId"), CONSTRAINT "REL_4221467b4b3a879ae8e9295f94" UNIQUE ("spdId"), CONSTRAINT "PK_2301fcddf238ba9c4916d39b1de" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bid_securities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "bidSecurityRequired" boolean NOT NULL, "bidSecurityAmount" integer, "bidSecurityCurrency" character varying, "bidSecurityForm" character varying NOT NULL, CONSTRAINT "PK_8f194178f3f5bcb5533f63a8c93" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP CONSTRAINT "REL_bc11ee765c17805cac6e3b2a95"`,
    );
    await queryRunner.query(`ALTER TABLE "bds_generals" DROP COLUMN "spdId"`);
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD "category" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP COLUMN "spdQualificationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD "spdQualificationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP COLUMN "spdTechnicalScoringId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD "spdTechnicalScoringId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP COLUMN "spdTechnicalScoringParentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD "spdTechnicalScoringParentId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "maximumPercentageContractingAllowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "maximumPercentageContractingAllowed" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP COLUMN "spdEqcPreliminaryExaminationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD "spdEqcPreliminaryExaminationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_0d09038a7c2856a68c38b8a9ff8" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_securities" ADD CONSTRAINT "FK_374ea9666832a46f9c84e2648e2" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "bid_securities" DROP CONSTRAINT "FK_374ea9666832a46f9c84e2648e2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_0d09038a7c2856a68c38b8a9ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP COLUMN "spdEqcPreliminaryExaminationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD "spdEqcPreliminaryExaminationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP COLUMN "maximumPercentageContractingAllowed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "maximumPercentageContractingAllowed" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP COLUMN "spdTechnicalScoringParentId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD "spdTechnicalScoringParentId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP COLUMN "spdTechnicalScoringId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD "spdTechnicalScoringId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP COLUMN "spdQualificationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD "spdQualificationId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP COLUMN "category"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD "spdId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD CONSTRAINT "REL_bc11ee765c17805cac6e3b2a95" UNIQUE ("spdId")`,
    );
    await queryRunner.query(`DROP TABLE "bid_securities"`);
    await queryRunner.query(`DROP TABLE "tender_spds"`);
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD CONSTRAINT "FK_bc11ee765c17805cac6e3b2a952" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
