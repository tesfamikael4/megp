import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnFormLink1716797687406 implements MigrationInterface {
  name = 'UpdateOnFormLink1716797687406';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP CONSTRAINT "FK_cb4e1b8ab1a15a13ec6e4e17e4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_658f9b1ff17d6ead74441bdcb63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" DROP CONSTRAINT "FK_789e155c0ef2b64eede144b37fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" DROP CONSTRAINT "FK_e98cddb96d27ed9563c8302a905"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP CONSTRAINT "FK_00b18b1b69a539ef55d17a1b46f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP CONSTRAINT "FK_6d9bdf843c6fe92ace9484132bf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_1f923a88c24fff43aa6140dff78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" RENAME COLUMN "formLink" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" RENAME COLUMN "bidFromId" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" RENAME COLUMN "bidFromId" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" RENAME COLUMN "bidFromId" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" RENAME COLUMN "bidFromId" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" RENAME COLUMN "bidFromId" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" RENAME COLUMN "bidFromId" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" RENAME COLUMN "bidFromId" TO "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" DROP COLUMN "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" ADD "bidFormId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" ADD CONSTRAINT "FK_5718b79392594dc3acc27146362" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD CONSTRAINT "FK_e8e6d0e4c943c7ae972ac8eab27" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_2664aaf0f794ef8a37f1e64de51" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" ADD CONSTRAINT "FK_3160ce89c78d126c39142ee45cb" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" ADD CONSTRAINT "FK_d69d1a2355d80f0937c056c9aba" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD CONSTRAINT "FK_cb7a7b136773d3c3bcc689baf48" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD CONSTRAINT "FK_27a32a6d449284ff914cdd24c05" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_072de8db7db61c5e9d68d81be1a" FOREIGN KEY ("bidFormId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_072de8db7db61c5e9d68d81be1a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP CONSTRAINT "FK_27a32a6d449284ff914cdd24c05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP CONSTRAINT "FK_cb7a7b136773d3c3bcc689baf48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" DROP CONSTRAINT "FK_d69d1a2355d80f0937c056c9aba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" DROP CONSTRAINT "FK_3160ce89c78d126c39142ee45cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_2664aaf0f794ef8a37f1e64de51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP CONSTRAINT "FK_e8e6d0e4c943c7ae972ac8eab27"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" DROP CONSTRAINT "FK_5718b79392594dc3acc27146362"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" DROP COLUMN "bidFormId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" ADD "bidFormId" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" RENAME COLUMN "bidFormId" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" RENAME COLUMN "bidFormId" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" RENAME COLUMN "bidFormId" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" RENAME COLUMN "bidFormId" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" RENAME COLUMN "bidFormId" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" RENAME COLUMN "bidFormId" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" RENAME COLUMN "bidFormId" TO "bidFromId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" RENAME COLUMN "bidFormId" TO "formLink"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_1f923a88c24fff43aa6140dff78" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD CONSTRAINT "FK_6d9bdf843c6fe92ace9484132bf" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD CONSTRAINT "FK_00b18b1b69a539ef55d17a1b46f" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_professional_settings" ADD CONSTRAINT "FK_e98cddb96d27ed9563c8302a905" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preliminary_evaluations" ADD CONSTRAINT "FK_789e155c0ef2b64eede144b37fd" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_658f9b1ff17d6ead74441bdcb63" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD CONSTRAINT "FK_cb4e1b8ab1a15a13ec6e4e17e4f" FOREIGN KEY ("bidFromId") REFERENCES "spd_bid_forms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
