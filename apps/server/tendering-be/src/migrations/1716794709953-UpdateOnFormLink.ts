import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnFormLink1716794709953 implements MigrationInterface {
  name = 'UpdateOnFormLink1716794709953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" RENAME COLUMN "formLink" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" RENAME COLUMN "formLink" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" RENAME COLUMN "formLink" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" RENAME COLUMN "formLink" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" RENAME COLUMN "formLink" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" RENAME COLUMN "formLink" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" RENAME COLUMN "formLink" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" ADD "bidFromId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" ADD "bidFromId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD "bidFromId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD "bidFromId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "bidFromId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "bidFromId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD "bidFromId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" ADD CONSTRAINT "FK_789e155c0ef2b64eede144b37fd" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" ADD CONSTRAINT "FK_e98cddb96d27ed9563c8302a905" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_658f9b1ff17d6ead74441bdcb63" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD CONSTRAINT "FK_cb4e1b8ab1a15a13ec6e4e17e4f" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD CONSTRAINT "FK_00b18b1b69a539ef55d17a1b46f" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_1f923a88c24fff43aa6140dff78" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD CONSTRAINT "FK_6d9bdf843c6fe92ace9484132bf" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP CONSTRAINT "FK_6d9bdf843c6fe92ace9484132bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_1f923a88c24fff43aa6140dff78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP CONSTRAINT "FK_00b18b1b69a539ef55d17a1b46f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP CONSTRAINT "FK_cb4e1b8ab1a15a13ec6e4e17e4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_658f9b1ff17d6ead74441bdcb63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" DROP CONSTRAINT "FK_e98cddb96d27ed9563c8302a905"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" DROP CONSTRAINT "FK_789e155c0ef2b64eede144b37fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD "bidFromId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD "bidFromId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD "bidFromId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD "bidFromId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD "bidFromId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" ADD "bidFromId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" DROP COLUMN "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" ADD "bidFromId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" RENAME COLUMN "bidFromId" TO "formLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" RENAME COLUMN "bidFromId" TO "formLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" RENAME COLUMN "bidFromId" TO "formLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" RENAME COLUMN "bidFromId" TO "formLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" RENAME COLUMN "bidFromId" TO "formLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" RENAME COLUMN "bidFromId" TO "formLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" RENAME COLUMN "bidFromId" TO "formLink"`,
    );
  }
}
