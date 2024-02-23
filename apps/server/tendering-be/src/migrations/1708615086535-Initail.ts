import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initail1708615086535 implements MigrationInterface {
  name = 'Initail1708615086535';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_scc" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb, "mandate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "prefix" character varying NOT NULL, CONSTRAINT "PK_54564d892d97c81916f96c6c371" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_bds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "prefix" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb NOT NULL, "mandate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "isInternalUse" boolean NOT NULL, CONSTRAINT "PK_a49f3d87d5d448c15ab7cdfdf94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "condition" character varying NOT NULL, "name" character varying NOT NULL, "preferenceType" character varying NOT NULL, "margin" numeric NOT NULL, CONSTRAINT "PK_b1cea0ea1235afb0b77cb29aaa7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_required_documentary_evidences" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "sectionLink" jsonb NOT NULL, "evidenceType" jsonb NOT NULL, "evidenceTitle" character varying NOT NULL, "checkOnFirstOpening" boolean NOT NULL, "checkOnSecondOpening" boolean NOT NULL, "checkOnSecondCompliance" boolean NOT NULL, "requiredTo" character varying NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "PK_00a6f4f66a10e7bc39c8993fa8b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "content" character varying NOT NULL, CONSTRAINT "PK_5982542237cd8de3ee4c9ded4b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "factor" character varying NOT NULL, "requirement" text NOT NULL, "attribute" character varying NOT NULL, "value" character varying NOT NULL, "singleEntityCondition" jsonb NOT NULL, "jvCominedCondition" jsonb NOT NULL, "jvEachPartherCondition" jsonb NOT NULL, "jvAtleastOnePartnerCondition" jsonb NOT NULL, "order" character varying NOT NULL, "formLink" character varying NOT NULL, "mandate" character varying NOT NULL, "itbDescription" character varying NOT NULL, CONSTRAINT "PK_d512ad5a2d5f6a790a5a5e793d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_administrative_compliances" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "itbDescription" character varying NOT NULL, "attribute" character varying NOT NULL, "value" character varying NOT NULL, "mandate" character varying NOT NULL, "order" integer NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "PK_8bcfcfe7a85b76c916661872a7e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_templates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "documentDocx" jsonb, "documentPdf" jsonb, "spdId" uuid NOT NULL, CONSTRAINT "PK_e2d7118c5872d3f54f78ab3609a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_technical_teams" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "userId" character varying NOT NULL, "isTeamLead" boolean NOT NULL, CONSTRAINT "PK_580667c2adc45b5f32acc7b4c77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "procurement_mechanisms" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "PRProcurementMechanisms" json NOT NULL, "invitationType" character varying NOT NULL, "marketApproach" character varying NOT NULL, "stageType" character varying NOT NULL, "stage" integer NOT NULL, CONSTRAINT "REL_3182144677e584be4c8019c9f7" UNIQUE ("tenderId"), CONSTRAINT "PK_8685ab6b89ae9fe4d5319ab84ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_technical_requirements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "sorType" character varying NOT NULL, "category" character varying NOT NULL, "requirement" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "requirementType" character varying NOT NULL, "formLink" character varying NOT NULL, CONSTRAINT "PK_498fa212fe8dc80a6107e96f546" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_submissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "submissionDeadline" date NOT NULL, "openingDate" date NOT NULL, "invitationDate" date NOT NULL, "envelopType" character varying NOT NULL, CONSTRAINT "REL_f4643c48139c99ed56b357ed5e" UNIQUE ("tenderId"), CONSTRAINT "PK_b5b417bdfc6f5fa01996a6c4c09" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_due_dilegence" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "requirement" character varying, "requirementCondition" character varying NOT NULL, CONSTRAINT "PK_1c46ab0fbc36f953498d31b3301" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "name" character varying, "condition" character varying NOT NULL, "margin" integer NOT NULL, CONSTRAINT "PK_8f0740d0fb0e9c99e980bf20039" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_preliminary_examinations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "criteria" character varying NOT NULL, "order" integer NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "requirementCondition" character varying NOT NULL, "type" character varying NOT NULL, "formLink" character varying NOT NULL, "spdEqcPreliminaryExaminationId" character varying NOT NULL, CONSTRAINT "PK_5ef92ca75ba18d713bde11530eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "factor" character varying NOT NULL, "requirement" character varying NOT NULL, "singleEntityCondition" jsonb NOT NULL, "jvEachPartnerCondition" jsonb NOT NULL, "jvCombinedPartnerCondition" jsonb NOT NULL, "jvAtleastOnePartnerCondition" jsonb NOT NULL, "order" integer NOT NULL, "formLink" character varying NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "spdQualificationId" character varying NOT NULL, CONSTRAINT "PK_388eb2d21f4348e91352b603d4d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "eqc_technical_scorings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "parentId" uuid, "requirement" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" integer NOT NULL, "formLink" character varying NOT NULL, "spdTechnicalScoringId" character varying, "spdTechnicalScoringParentId" character varying, "isProfessional" boolean NOT NULL, "hasProfessional" boolean NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "REL_76e57cba6ff7dd3b57cc86cc7e" UNIQUE ("parentId"), CONSTRAINT "PK_b77fd2261dfcadd1bf7b7ce220b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_awards" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "percentageQuantityIncreased" integer NOT NULL, "percentageQuantityDecreased" integer NOT NULL, "negotiationAllowed" boolean NOT NULL, CONSTRAINT "REL_360a587c5c63482a136ec4a93d" UNIQUE ("tenderId"), CONSTRAINT "PK_d562f5d119de65df4b18dd8f855" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidEvaluationCurrency" text NOT NULL, "evaluationMethod" character varying NOT NULL, "selectionMethod" character varying NOT NULL, "awardType" character varying NOT NULL, "technicalWeight" integer NOT NULL, "financialWeight" integer NOT NULL, "passingMark" integer NOT NULL, CONSTRAINT "REL_32110ff8c972bd861c32fdacb2" UNIQUE ("tenderId"), CONSTRAINT "PK_081f71b1010b0e8d30c8113264a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_preparations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "currencyOfTheBidForNationalBidders" jsonb NOT NULL, "currencyOfTheBidForInternationalBidders" jsonb NOT NULL, "incotermsEdition" character varying NOT NULL, "incotermType" character varying NOT NULL, "bidValidityPeriod" integer NOT NULL, CONSTRAINT "REL_19798e60cc425f76fd8c92ef7b" UNIQUE ("tenderId"), CONSTRAINT "PK_065f63f73ee399a52aa77aae961" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_bill_of_materials" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "parentId" uuid, "payItem" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "REL_8fac7c9c13bd7e421bd0638e40" UNIQUE ("parentId"), CONSTRAINT "PK_b872c04b57d2922919011de135c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "description" character varying NOT NULL, "attachment" jsonb NOT NULL, CONSTRAINT "PK_75b13abd98099f9a05a2c2063a6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_equipments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_5889e95b0ac6069f9d5c7f5262f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_fees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "category" character varying NOT NULL, "position" character varying NOT NULL, "nameOfStaff" character varying NOT NULL, "staffMonthRate" integer NOT NULL, "inputStaffMonth" integer NOT NULL, "rate" integer NOT NULL, CONSTRAINT "PK_6b9d5be14d3e030748fad6a07f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_incidental_costs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "country" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_96e7cf682c0cd2b1612aef4eb7f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_labors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_90dbcc809c576b65ef2ac80a37d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sor_reimburseable_expenses" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "unitCost" integer NOT NULL, "cost" integer NOT NULL, CONSTRAINT "PK_86094dcad0a193cb9c804595397" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "itemCode" character varying NOT NULL, "itemType" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitOfMeasure" character varying NOT NULL, "estimatedPrice" integer NOT NULL, "estimatedPriceCurrency" character varying NOT NULL, "marketPrice" integer NOT NULL, "marketPriceCurrency" character varying NOT NULL, "hasBom" boolean NOT NULL, "metaData" jsonb NOT NULL, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lots" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "number" integer NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, "metadata" jsonb NOT NULL, CONSTRAINT "PK_2bb990a4015865cb1daa1d22fd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "procurementReferenceNumber" character varying, "budgetAmount" integer NOT NULL, "budgetAmountCurrency" character varying NOT NULL, "budgetCode" character varying NOT NULL, "prId" character varying NOT NULL, "marketEstimate" integer NOT NULL, "marketEstimateCurrency" character varying NOT NULL, "status" character varying NOT NULL, "metadata" jsonb, "organizationId" character varying NOT NULL, CONSTRAINT "PK_13fdd4229818a97b5102199463b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bds_generals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "jointVentureAllowed" boolean NOT NULL, "maximumNumberOfMembers" integer NOT NULL, "subContractAllowed" boolean NOT NULL, "maximumPercentageContractingAllowed" date NOT NULL, "clarificationDeadline" date NOT NULL, "preBidConferenceRequired" boolean NOT NULL, "preBidConferenceDate" date NOT NULL, "spdId" uuid NOT NULL, "siteVisitAllowed" boolean NOT NULL, CONSTRAINT "REL_a9b475d7e1baf128ac85bd5990" UNIQUE ("tenderId"), CONSTRAINT "REL_bc11ee765c17805cac6e3b2a95" UNIQUE ("spdId"), CONSTRAINT "PK_d6e0368edc816d219b1e649b4af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "governingRule" jsonb, "name" character varying NOT NULL, "description" character varying NOT NULL, "marketType" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_c048f166470e0a788481a2a744c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_technical_scoring" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "orderNo" numeric NOT NULL, "parentId" uuid NOT NULL, "requirement" character varying NOT NULL, "specification" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" numeric NOT NULL, "formLink" character varying NOT NULL, "additionalRequirements" character varying NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, "isProfessional" boolean NOT NULL, "isRangeBasedCriteria" boolean NOT NULL, CONSTRAINT "PK_94c7ee37dd96288ad502ea3e8cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" ADD CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" ADD CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" ADD CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_required_documentary_evidences" ADD CONSTRAINT "FK_5e0fe2b5e8456cba4ef0cc938a9" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_settings" ADD CONSTRAINT "FK_7885efb8db0be2f53cb5cfff0f4" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" ADD CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_administrative_compliances" ADD CONSTRAINT "FK_906e0ae3335f8115ab701efb2b6" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" ADD CONSTRAINT "FK_58b133159821f269d4a9e102981" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_technical_teams" ADD CONSTRAINT "FK_16ed8516699dfbc7bad19f13768" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" ADD CONSTRAINT "FK_3182144677e584be4c8019c9f71" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" ADD CONSTRAINT "FK_3b9d41f1264232adabc1a493fbd" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" ADD CONSTRAINT "FK_f4643c48139c99ed56b357ed5ec" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_due_dilegence" ADD CONSTRAINT "FK_4b99cd3b56eaa260dc57d3726a0" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preference_margins" ADD CONSTRAINT "FK_4003ff741f9fbca17a01a6aefff" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" ADD CONSTRAINT "FK_19a734e654f04171cdce776c1aa" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" ADD CONSTRAINT "FK_8aba0f82e6e77b18e9e7a9d385f" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_f9b07d7fe0575bf583ac36721eb" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" ADD CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed" FOREIGN KEY ("parentId") REFERENCES "eqc_technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_awards" ADD CONSTRAINT "FK_360a587c5c63482a136ec4a93d4" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" ADD CONSTRAINT "FK_32110ff8c972bd861c32fdacb20" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_preparations" ADD CONSTRAINT "FK_19798e60cc425f76fd8c92ef7bd" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD CONSTRAINT "FK_86846ef638b3d96853dfd0e8bca" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" ADD CONSTRAINT "FK_8fac7c9c13bd7e421bd0638e40f" FOREIGN KEY ("parentId") REFERENCES "sor_bill_of_materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_documents" ADD CONSTRAINT "FK_8f7ae34384e73ab537b8863114d" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" ADD CONSTRAINT "FK_a61e9c1b02f826a197432ccac5d" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_fees" ADD CONSTRAINT "FK_01c97aac7ad3d5a8b8a319eed50" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" ADD CONSTRAINT "FK_d6027efe05b712e68fb6fc5cf59" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" ADD CONSTRAINT "FK_0acf3073e003f8808e52eff7819" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_reimburseable_expenses" ADD CONSTRAINT "FK_13cc9a2fe8b38b3e292700bd99a" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_1941a6957ec883c261b003a92f7" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ADD CONSTRAINT "FK_ff305ca55fdc2a8ee2e143d2c61" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD CONSTRAINT "FK_a9b475d7e1baf128ac85bd5990a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" ADD CONSTRAINT "FK_bc11ee765c17805cac6e3b2a952" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_7f257d2363c8da5a70aef384760" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_7f257d2363c8da5a70aef384760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP CONSTRAINT "FK_bc11ee765c17805cac6e3b2a952"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_generals" DROP CONSTRAINT "FK_a9b475d7e1baf128ac85bd5990a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" DROP CONSTRAINT "FK_ff305ca55fdc2a8ee2e143d2c61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_1941a6957ec883c261b003a92f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_reimburseable_expenses" DROP CONSTRAINT "FK_13cc9a2fe8b38b3e292700bd99a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_labors" DROP CONSTRAINT "FK_0acf3073e003f8808e52eff7819"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_incidental_costs" DROP CONSTRAINT "FK_d6027efe05b712e68fb6fc5cf59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_fees" DROP CONSTRAINT "FK_01c97aac7ad3d5a8b8a319eed50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_equipments" DROP CONSTRAINT "FK_a61e9c1b02f826a197432ccac5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_documents" DROP CONSTRAINT "FK_8f7ae34384e73ab537b8863114d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP CONSTRAINT "FK_8fac7c9c13bd7e421bd0638e40f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_bill_of_materials" DROP CONSTRAINT "FK_86846ef638b3d96853dfd0e8bca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_preparations" DROP CONSTRAINT "FK_19798e60cc425f76fd8c92ef7bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_evaluations" DROP CONSTRAINT "FK_32110ff8c972bd861c32fdacb20"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_awards" DROP CONSTRAINT "FK_360a587c5c63482a136ec4a93d4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_76e57cba6ff7dd3b57cc86cc7ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_technical_scorings" DROP CONSTRAINT "FK_f9b07d7fe0575bf583ac36721eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_qualifications" DROP CONSTRAINT "FK_8aba0f82e6e77b18e9e7a9d385f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preliminary_examinations" DROP CONSTRAINT "FK_19a734e654f04171cdce776c1aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_preference_margins" DROP CONSTRAINT "FK_4003ff741f9fbca17a01a6aefff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "eqc_due_dilegence" DROP CONSTRAINT "FK_4b99cd3b56eaa260dc57d3726a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bds_submissions" DROP CONSTRAINT "FK_f4643c48139c99ed56b357ed5ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sor_technical_requirements" DROP CONSTRAINT "FK_3b9d41f1264232adabc1a493fbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_mechanisms" DROP CONSTRAINT "FK_3182144677e584be4c8019c9f71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procurement_technical_teams" DROP CONSTRAINT "FK_16ed8516699dfbc7bad19f13768"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_templates" DROP CONSTRAINT "FK_58b133159821f269d4a9e102981"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_administrative_compliances" DROP CONSTRAINT "FK_906e0ae3335f8115ab701efb2b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_qualifications" DROP CONSTRAINT "FK_031f8ca8e326af6c18fac49ba89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_settings" DROP CONSTRAINT "FK_7885efb8db0be2f53cb5cfff0f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_required_documentary_evidences" DROP CONSTRAINT "FK_5e0fe2b5e8456cba4ef0cc938a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_preference_margins" DROP CONSTRAINT "FK_79cfc4d67926a83086fa669d3d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" DROP CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" DROP CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba"`,
    );
    await queryRunner.query(`DROP TABLE "spd_technical_scoring"`);
    await queryRunner.query(`DROP TABLE "spd"`);
    await queryRunner.query(`DROP TABLE "bds_generals"`);
    await queryRunner.query(`DROP TABLE "tenders"`);
    await queryRunner.query(`DROP TABLE "lots"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "sor_reimburseable_expenses"`);
    await queryRunner.query(`DROP TABLE "sor_labors"`);
    await queryRunner.query(`DROP TABLE "sor_incidental_costs"`);
    await queryRunner.query(`DROP TABLE "sor_fees"`);
    await queryRunner.query(`DROP TABLE "sor_equipments"`);
    await queryRunner.query(`DROP TABLE "sor_documents"`);
    await queryRunner.query(`DROP TABLE "sor_bill_of_materials"`);
    await queryRunner.query(`DROP TABLE "bds_preparations"`);
    await queryRunner.query(`DROP TABLE "bds_evaluations"`);
    await queryRunner.query(`DROP TABLE "bds_awards"`);
    await queryRunner.query(`DROP TABLE "eqc_technical_scorings"`);
    await queryRunner.query(`DROP TABLE "eqc_qualifications"`);
    await queryRunner.query(`DROP TABLE "eqc_preliminary_examinations"`);
    await queryRunner.query(`DROP TABLE "eqc_preference_margins"`);
    await queryRunner.query(`DROP TABLE "eqc_due_dilegence"`);
    await queryRunner.query(`DROP TABLE "bds_submissions"`);
    await queryRunner.query(`DROP TABLE "sor_technical_requirements"`);
    await queryRunner.query(`DROP TABLE "procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "procurement_technical_teams"`);
    await queryRunner.query(`DROP TABLE "spd_templates"`);
    await queryRunner.query(`DROP TABLE "spd_administrative_compliances"`);
    await queryRunner.query(`DROP TABLE "spd_qualifications"`);
    await queryRunner.query(`DROP TABLE "spd_settings"`);
    await queryRunner.query(`DROP TABLE "spd_required_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "spd_preference_margins"`);
    await queryRunner.query(`DROP TABLE "spd_bds"`);
    await queryRunner.query(`DROP TABLE "spd_scc"`);
  }
}
