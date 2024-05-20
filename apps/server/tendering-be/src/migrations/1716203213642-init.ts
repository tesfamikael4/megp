import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1716203213642 implements MigrationInterface {
  name = 'Init1716203213642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "PK_b9042079141d0d29c652ddbf906" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "PK_2301fcddf238ba9c4916d39b1de" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "UQ_0d09038a7c2856a68c38b8a9ff8" UNIQUE ("tenderId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "PK_2d82b8657a27632fbe0c0272d90" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" ADD CONSTRAINT "PK_150e11a9e6fb9616e0ea7aeb0c1" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" ADD CONSTRAINT "PK_e1d85ee8f32fad802377ebe2590" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "PK_52f12b716d98e3bc5b5e8342e3d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ADD CONSTRAINT "PK_5889e95b0ac6069f9d5c7f5262f" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" ADD CONSTRAINT "PK_5c8e095ea8c8516a4370da8ea44" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" ADD CONSTRAINT "PK_29d8df4b5e1ccddf8203816d302" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" ADD CONSTRAINT "UQ_bb8523ce3a8e3441e0642278dd7" UNIQUE ("tenderId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" ADD CONSTRAINT "PK_d1a8a37d20b6130a8583bdf6825" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "PK_de6438ada062ef318599bec324d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones_trackers" ADD CONSTRAINT "PK_f24c9f1797cfd09afb32dd1501d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "PK_34e8e1d5c7287e32f12e68ea4b8" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "UQ_cd34c2caacca5a167299df21bd7" UNIQUE ("bidRegistrationDetailId", "eqcDocumentaryEvidenceId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86" UNIQUE ("lotId", "milestoneNum", "isCurrent")`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_74c9ef57a86737836148803b822" FOREIGN KEY ("technicalPreliminaryAssessmentId") REFERENCES "technical_preliminary_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" ADD CONSTRAINT "FK_4cd4654d6e6459a3ee62f332dd3" FOREIGN KEY ("eqcPreliminaryExaminationId") REFERENCES "eqc_preliminary_examinations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_0d09038a7c2856a68c38b8a9ff8" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_90853706993b68593dbb0b8633e" FOREIGN KEY ("technicalQualificationAssessmentId") REFERENCES "technical_qualification_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" ADD CONSTRAINT "FK_72474d19284a1b321904f6a85a3" FOREIGN KEY ("eqcQualificationId") REFERENCES "eqc_qualifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" ADD CONSTRAINT "FK_8a7460645ba5245edc7bbbab4f9" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" ADD CONSTRAINT "FK_b2a5089c12423aa10b5f14ce8dc" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_682b03c8b81a12fda829ab48926" FOREIGN KEY ("technicalResponsivenessAssessmentId") REFERENCES "technical_responsiveness_assessments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" ADD CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649" FOREIGN KEY ("sorTechnicalRequirementId") REFERENCES "sor_technical_requirements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ADD CONSTRAINT "FK_a61e9c1b02f826a197432ccac5d" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" ADD CONSTRAINT "FK_0a45e81c8e5f421b80ee4498130" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" ADD CONSTRAINT "FK_bb8523ce3a8e3441e0642278dd7" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" ADD CONSTRAINT "FK_f8ddc0f232115aa707cb1116a6c" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "FK_fb32b5807888d323983d74d196d" FOREIGN KEY ("bidRegistrationDetailId") REFERENCES "bid_registration_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" ADD CONSTRAINT "FK_2aea937a675e2a19962163beaf1" FOREIGN KEY ("eqcDocumentaryEvidenceId") REFERENCES "eqc_documentary_evidences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "FK_807061b2fa4325cc72a721138de" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" ADD CONSTRAINT "FK_907ca5c1c8d5c923b3e480122ee" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "FK_907ca5c1c8d5c923b3e480122ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "FK_807061b2fa4325cc72a721138de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "FK_2aea937a675e2a19962163beaf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "FK_fb32b5807888d323983d74d196d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" DROP CONSTRAINT "FK_f8ddc0f232115aa707cb1116a6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" DROP CONSTRAINT "FK_bb8523ce3a8e3441e0642278dd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" DROP CONSTRAINT "FK_0a45e81c8e5f421b80ee4498130"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" DROP CONSTRAINT "FK_a61e9c1b02f826a197432ccac5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_4980f2b2352cdb1cf4743ea5649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "FK_682b03c8b81a12fda829ab48926"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" DROP CONSTRAINT "FK_b2a5089c12423aa10b5f14ce8dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" DROP CONSTRAINT "FK_8a7460645ba5245edc7bbbab4f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_72474d19284a1b321904f6a85a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "FK_90853706993b68593dbb0b8633e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_0d09038a7c2856a68c38b8a9ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_4cd4654d6e6459a3ee62f332dd3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "FK_74c9ef57a86737836148803b822"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "UQ_dee4d72868fb9237de5ee8cfc86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "UQ_cd34c2caacca5a167299df21bd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_milestones" DROP CONSTRAINT "PK_34e8e1d5c7287e32f12e68ea4b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "milestones_trackers" DROP CONSTRAINT "PK_f24c9f1797cfd09afb32dd1501d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bid_response_documentary_evidences" DROP CONSTRAINT "PK_de6438ada062ef318599bec324d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_personals" DROP CONSTRAINT "PK_d1a8a37d20b6130a8583bdf6825"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" DROP CONSTRAINT "UQ_bb8523ce3a8e3441e0642278dd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_participation_fees" DROP CONSTRAINT "PK_29d8df4b5e1ccddf8203816d302"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_classifications" DROP CONSTRAINT "PK_5c8e095ea8c8516a4370da8ea44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" DROP CONSTRAINT "PK_5889e95b0ac6069f9d5c7f5262f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessment_detail" DROP CONSTRAINT "PK_52f12b716d98e3bc5b5e8342e3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_responsiveness_assessments" DROP CONSTRAINT "PK_e1d85ee8f32fad802377ebe2590"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessments" DROP CONSTRAINT "PK_150e11a9e6fb9616e0ea7aeb0c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_qualification_assessment_detail" DROP CONSTRAINT "PK_2d82b8657a27632fbe0c0272d90"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "UQ_0d09038a7c2856a68c38b8a9ff8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "PK_2301fcddf238ba9c4916d39b1de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_preliminary_assessment_details" DROP CONSTRAINT "PK_b9042079141d0d29c652ddbf906"`,
    );
  }
}
