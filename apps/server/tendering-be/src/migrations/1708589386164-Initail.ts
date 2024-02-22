import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initail1708589386164 implements MigrationInterface {
  name = 'Initail1708589386164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "spd_scc" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb, "mandate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "prefix" character varying NOT NULL, CONSTRAINT "PK_54564d892d97c81916f96c6c371" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_bds" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "category" character varying NOT NULL, "prefix" character varying NOT NULL, "itbReference" character varying NOT NULL, "attribute" character varying NOT NULL, "value" jsonb NOT NULL, "mandate" character varying NOT NULL, "inputType" character varying NOT NULL, "order" integer NOT NULL, "description" character varying NOT NULL, "dependency" jsonb NOT NULL, "readOnly" boolean NOT NULL, "isRequired" boolean NOT NULL, "isInternalUse" boolean NOT NULL, CONSTRAINT "PK_a49f3d87d5d448c15ab7cdfdf94" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd_technical_scoring" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "spdId" uuid NOT NULL, "orderNo" numeric NOT NULL, "parentId" uuid NOT NULL, "requirement" character varying NOT NULL, "specification" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" numeric NOT NULL, "formLink" character varying NOT NULL, "additionalRequirements" character varying NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, "isProfessional" boolean NOT NULL, "isRangeBasedCriteria" boolean NOT NULL, CONSTRAINT "PK_94c7ee37dd96288ad502ea3e8cd" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "technical_requirements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "sorType" character varying NOT NULL, "category" character varying NOT NULL, "requirement" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "requirementType" character varying NOT NULL, "formLink" character varying NOT NULL, CONSTRAINT "PK_c109904784304952a6fb43a221a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reimburseable_expense" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "unitCost" integer NOT NULL, "cost" integer NOT NULL, CONSTRAINT "PK_25eaad8792b2d15ff7f861155b2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "bill_of_materials" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "parentId" uuid, "payItem" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "REL_7697a8953a861fc062428e31e9" UNIQUE ("parentId"), CONSTRAINT "PK_e81379203e4149d01c634d7e083" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "equipments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_250348d5d9ae4946bcd634f3e61" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fees" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "category" character varying NOT NULL, "position" character varying NOT NULL, "nameOfStaff" character varying NOT NULL, "staffMonthRate" integer NOT NULL, "inputStaffMonth" integer NOT NULL, "rate" integer NOT NULL, CONSTRAINT "PK_97f3a1b1b8ee5674fd4da93f461" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "incidental_costs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "country" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_a756dc593491d1b739d516ce5c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "labors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "itemNumber" character varying NOT NULL, "description" character varying NOT NULL, "unit" character varying NOT NULL, "quantity" integer NOT NULL, "rate" integer NOT NULL, "amount" integer NOT NULL, CONSTRAINT "PK_4bbbba0a14ea1f433f71363634a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "documents" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemId" uuid NOT NULL, "description" character varying NOT NULL, "attachment" jsonb NOT NULL, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "itemCode" character varying NOT NULL, "itemType" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "quantity" integer NOT NULL, "unitOfMeasure" character varying NOT NULL, "estimatedPrice" character varying NOT NULL, "estimatedPriceCurrency" character varying NOT NULL, "marketPrice" character varying NOT NULL, "marketPriceCurrency" character varying NOT NULL, "hasBom" boolean NOT NULL, "metaData" jsonb NOT NULL, CONSTRAINT "PK_ba5885359424c15ca6b9e79bcf6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "preliminary_examinations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "criteria" character varying NOT NULL, "order" integer NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "requirementCondition" character varying NOT NULL, "type" character varying NOT NULL, "formLink" character varying NOT NULL, "spdPreliminaryExaminationId" character varying NOT NULL, CONSTRAINT "PK_3f1baec3d526e2cf4c8709b3ff5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "qualifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "factor" character varying NOT NULL, "requirement" character varying NOT NULL, "singleEntityCondition" jsonb NOT NULL, "jvEachPartnerCondition" jsonb NOT NULL, "jvCombinedPartnerCondition" jsonb NOT NULL, "jvAtleastOnePartnerCondition" jsonb NOT NULL, "order" integer NOT NULL, "formLink" character varying NOT NULL, "itbDescription" character varying, "itbReference" character varying NOT NULL, "isRequired" boolean NOT NULL, "spdQualificationId" character varying NOT NULL, CONSTRAINT "PK_9ed4d526ac3b76ba3f1c1080433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "preference_margins" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "name" character varying, "condition" character varying NOT NULL, "margin" integer NOT NULL, CONSTRAINT "PK_17e5a109c21032014ad83ae2580" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "due_diligence" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "requirement" character varying, "requirementCondition" character varying NOT NULL, CONSTRAINT "PK_bcdd3699878a17429fa70f5181f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lots" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "number" integer NOT NULL, "name" character varying NOT NULL, "status" character varying NOT NULL, "metadata" jsonb NOT NULL, CONSTRAINT "PK_2bb990a4015865cb1daa1d22fd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "preparations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "currencyOfTheBidForNationalBidders" jsonb NOT NULL, "currencyOfTheBidForInternationalBidders" jsonb NOT NULL, "incotermsEdition" character varying NOT NULL, "incotermType" character varying NOT NULL, "bidValidityPeriod" integer NOT NULL, CONSTRAINT "REL_e61b1e2dc38d17cc17ae631bc0" UNIQUE ("tenderId"), CONSTRAINT "PK_b821aa801c36dc1176084d8ca10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "submissionDeadline" date NOT NULL, "openingDate" date NOT NULL, "invitationDate" date NOT NULL, "envelopType" character varying NOT NULL, CONSTRAINT "REL_32a05928f0d7801bae4d248bd8" UNIQUE ("tenderId"), CONSTRAINT "PK_10b3be95b8b2fb1e482e07d706b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "evaluations" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "bidEvaluationCurrency" text NOT NULL, "evaluationMethod" character varying NOT NULL, "selectionMethod" character varying NOT NULL, "awardType" character varying NOT NULL, "technicalWeight" integer NOT NULL, "financialWeight" integer NOT NULL, "passingMark" integer NOT NULL, CONSTRAINT "REL_5cb354ffba18e83711660c53cd" UNIQUE ("tenderId"), CONSTRAINT "PK_f683b433eba0e6dae7e19b29e29" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "awards" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "percentageQuantityIncreased" integer NOT NULL, "percentageQuantityDecreased" integer NOT NULL, "negotiationAllowed" boolean NOT NULL, CONSTRAINT "REL_c8d837c875f8300e04be26dbcf" UNIQUE ("tenderId"), CONSTRAINT "PK_bc3f6adc548ff46c76c03e06377" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "procurementReferenceNumber" character varying, "budgetAmount" integer NOT NULL, "budgetAmountCurrency" character varying NOT NULL, "budgetCode" character varying NOT NULL, "prId" character varying NOT NULL, "marketEstimate" integer NOT NULL, "marketEstimateCurrency" character varying NOT NULL, "status" character varying NOT NULL, "metadata" jsonb NOT NULL, "organizationId" character varying NOT NULL, CONSTRAINT "PK_13fdd4229818a97b5102199463b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "generals" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tenderId" uuid NOT NULL, "jointVentureAllowed" boolean NOT NULL, "maximumNumberOfMembers" integer NOT NULL, "subContractAllowed" boolean NOT NULL, "maximumPercentageContractingAllowed" date NOT NULL, "clarificationDeadline" date NOT NULL, "preBidConferenceRequired" boolean NOT NULL, "preBidConferenceDate" date NOT NULL, "spdId" uuid NOT NULL, "siteVisitAllowed" boolean NOT NULL, CONSTRAINT "REL_fa9db11b19b258c8f9c8480c1d" UNIQUE ("tenderId"), CONSTRAINT "REL_b5d3713eacacdb77adf7df5878" UNIQUE ("spdId"), CONSTRAINT "PK_8a446ed0f24495f22cd0e9afce6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "spd" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "governingRule" jsonb, "name" character varying NOT NULL, "description" character varying NOT NULL, "marketType" character varying NOT NULL, "procurementCategory" character varying NOT NULL, "isActive" boolean NOT NULL, CONSTRAINT "PK_c048f166470e0a788481a2a744c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "technical_scorings" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "lotId" uuid NOT NULL, "parentId" uuid, "requirement" character varying NOT NULL, "requirementCondition" character varying NOT NULL, "point" integer NOT NULL, "formLink" character varying NOT NULL, "spdTechnicalScoringId" character varying, "spdTechnicalScoringParentId" character varying, "isProfessional" boolean NOT NULL, "hasProfessional" boolean NOT NULL, "validation" jsonb NOT NULL, "isRequired" boolean NOT NULL, CONSTRAINT "REL_284068eea19a0ce00501f76562" UNIQUE ("parentId"), CONSTRAINT "PK_2e495d28d78b062ad254884aff8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" ADD CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" ADD CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_technical_scoring" ADD CONSTRAINT "FK_7f257d2363c8da5a70aef384760" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "technical_requirements" ADD CONSTRAINT "FK_902a2c5330611a0cee79b52af1f" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reimburseable_expense" ADD CONSTRAINT "FK_609d307517208fde54a18aec516" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bill_of_materials" ADD CONSTRAINT "FK_11a5247abf43025796ac11f2ee7" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "bill_of_materials" ADD CONSTRAINT "FK_7697a8953a861fc062428e31e9e" FOREIGN KEY ("parentId") REFERENCES "bill_of_materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipments" ADD CONSTRAINT "FK_e245ed82cd5ed326f0d42984965" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees" ADD CONSTRAINT "FK_6adcbc508358358c99e87cb7a4a" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidental_costs" ADD CONSTRAINT "FK_26bcd2a7360021fef6f63dffbd8" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "labors" ADD CONSTRAINT "FK_12c041171998b70edce5e6d8bcc" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "FK_50e7938af082a1997f8764d5567" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" ADD CONSTRAINT "FK_1941a6957ec883c261b003a92f7" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preliminary_examinations" ADD CONSTRAINT "FK_1fc5be98f7f6ceaf2b8101be988" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "qualifications" ADD CONSTRAINT "FK_99f4b2d65657ca5d351171e0959" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preference_margins" ADD CONSTRAINT "FK_04f1886a5170c6eaff1628621d2" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "due_diligence" ADD CONSTRAINT "FK_66be7ec67ea0d34fbe624cfb9a5" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" ADD CONSTRAINT "FK_ff305ca55fdc2a8ee2e143d2c61" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparations" ADD CONSTRAINT "FK_e61b1e2dc38d17cc17ae631bc0a" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" ADD CONSTRAINT "FK_32a05928f0d7801bae4d248bd8e" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluations" ADD CONSTRAINT "FK_5cb354ffba18e83711660c53cd1" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" ADD CONSTRAINT "FK_c8d837c875f8300e04be26dbcfb" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "generals" ADD CONSTRAINT "FK_fa9db11b19b258c8f9c8480c1d5" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "generals" ADD CONSTRAINT "FK_b5d3713eacacdb77adf7df5878e" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scorings" ADD CONSTRAINT "FK_7b0108eacb00aa4ae9bef8f787b" FOREIGN KEY ("lotId") REFERENCES "lots"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scorings" ADD CONSTRAINT "FK_284068eea19a0ce00501f765621" FOREIGN KEY ("parentId") REFERENCES "technical_scorings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "technical_scorings" DROP CONSTRAINT "FK_284068eea19a0ce00501f765621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_scorings" DROP CONSTRAINT "FK_7b0108eacb00aa4ae9bef8f787b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "generals" DROP CONSTRAINT "FK_b5d3713eacacdb77adf7df5878e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "generals" DROP CONSTRAINT "FK_fa9db11b19b258c8f9c8480c1d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "awards" DROP CONSTRAINT "FK_c8d837c875f8300e04be26dbcfb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "evaluations" DROP CONSTRAINT "FK_5cb354ffba18e83711660c53cd1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submissions" DROP CONSTRAINT "FK_32a05928f0d7801bae4d248bd8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preparations" DROP CONSTRAINT "FK_e61b1e2dc38d17cc17ae631bc0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lots" DROP CONSTRAINT "FK_ff305ca55fdc2a8ee2e143d2c61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "due_diligence" DROP CONSTRAINT "FK_66be7ec67ea0d34fbe624cfb9a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preference_margins" DROP CONSTRAINT "FK_04f1886a5170c6eaff1628621d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "qualifications" DROP CONSTRAINT "FK_99f4b2d65657ca5d351171e0959"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preliminary_examinations" DROP CONSTRAINT "FK_1fc5be98f7f6ceaf2b8101be988"`,
    );
    await queryRunner.query(
      `ALTER TABLE "items" DROP CONSTRAINT "FK_1941a6957ec883c261b003a92f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "FK_50e7938af082a1997f8764d5567"`,
    );
    await queryRunner.query(
      `ALTER TABLE "labors" DROP CONSTRAINT "FK_12c041171998b70edce5e6d8bcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "incidental_costs" DROP CONSTRAINT "FK_26bcd2a7360021fef6f63dffbd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "fees" DROP CONSTRAINT "FK_6adcbc508358358c99e87cb7a4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipments" DROP CONSTRAINT "FK_e245ed82cd5ed326f0d42984965"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bill_of_materials" DROP CONSTRAINT "FK_7697a8953a861fc062428e31e9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bill_of_materials" DROP CONSTRAINT "FK_11a5247abf43025796ac11f2ee7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reimburseable_expense" DROP CONSTRAINT "FK_609d307517208fde54a18aec516"`,
    );
    await queryRunner.query(
      `ALTER TABLE "technical_requirements" DROP CONSTRAINT "FK_902a2c5330611a0cee79b52af1f"`,
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
      `ALTER TABLE "spd_technical_scoring" DROP CONSTRAINT "FK_7f257d2363c8da5a70aef384760"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_bds" DROP CONSTRAINT "FK_3fa5a61144d7b5eea5f3673968e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "spd_scc" DROP CONSTRAINT "FK_4293a67e19773fc97dd6a8fd5ba"`,
    );
    await queryRunner.query(`DROP TABLE "technical_scorings"`);
    await queryRunner.query(`DROP TABLE "spd"`);
    await queryRunner.query(`DROP TABLE "generals"`);
    await queryRunner.query(`DROP TABLE "tenders"`);
    await queryRunner.query(`DROP TABLE "awards"`);
    await queryRunner.query(`DROP TABLE "evaluations"`);
    await queryRunner.query(`DROP TABLE "submissions"`);
    await queryRunner.query(`DROP TABLE "preparations"`);
    await queryRunner.query(`DROP TABLE "lots"`);
    await queryRunner.query(`DROP TABLE "due_diligence"`);
    await queryRunner.query(`DROP TABLE "preference_margins"`);
    await queryRunner.query(`DROP TABLE "qualifications"`);
    await queryRunner.query(`DROP TABLE "preliminary_examinations"`);
    await queryRunner.query(`DROP TABLE "items"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TABLE "labors"`);
    await queryRunner.query(`DROP TABLE "incidental_costs"`);
    await queryRunner.query(`DROP TABLE "fees"`);
    await queryRunner.query(`DROP TABLE "equipments"`);
    await queryRunner.query(`DROP TABLE "bill_of_materials"`);
    await queryRunner.query(`DROP TABLE "reimburseable_expense"`);
    await queryRunner.query(`DROP TABLE "technical_requirements"`);
    await queryRunner.query(`DROP TABLE "procurement_mechanisms"`);
    await queryRunner.query(`DROP TABLE "procurement_technical_teams"`);
    await queryRunner.query(`DROP TABLE "spd_templates"`);
    await queryRunner.query(`DROP TABLE "spd_administrative_compliances"`);
    await queryRunner.query(`DROP TABLE "spd_qualifications"`);
    await queryRunner.query(`DROP TABLE "spd_settings"`);
    await queryRunner.query(`DROP TABLE "spd_required_documentary_evidences"`);
    await queryRunner.query(`DROP TABLE "spd_preference_margins"`);
    await queryRunner.query(`DROP TABLE "spd_technical_scoring"`);
    await queryRunner.query(`DROP TABLE "spd_bds"`);
    await queryRunner.query(`DROP TABLE "spd_scc"`);
  }
}
