import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1700428997429 implements MigrationInterface {
    name = 'Initial1700428997429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shareholders" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying, "lastName" character varying, "vendorId" uuid, "nationality" character varying NOT NULL DEFAULT 'Malian', "share" character varying NOT NULL, CONSTRAINT "PK_bbe6cd94b1b69fe6edb73f983a1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "custom_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying NOT NULL, "vendorId" uuid NOT NULL, CONSTRAINT "PK_87d32c14a80a1c53a670103666c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "description" character varying NOT NULL, "businessArea" character varying NOT NULL, "parentId" character varying, "parentCategoryId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "business_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "categoryId" uuid NOT NULL, "vendorId" uuid NOT NULL, CONSTRAINT "PK_d10a707dfd0ca189233999204e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "beneficial_ownership" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "vendorId" uuid, "nationality" character varying NOT NULL, "key" character varying, CONSTRAINT "PK_410dec44dbc2fb173555c9b079e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "business_interest_area" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" character varying NOT NULL, "lineOfBusiness" jsonb NOT NULL DEFAULT '[]', "priceRange" character varying NOT NULL, "vendorId" uuid, CONSTRAINT "PK_64c91ee0d2c26b78d2bf73a54c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_pricing" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceId" uuid NOT NULL, "businessArea" character varying NOT NULL, "valueFrom" numeric NOT NULL, "valueTo" numeric NOT NULL, "fee" numeric NOT NULL, "currency" character varying NOT NULL, CONSTRAINT "PK_a9d4b6cf683e43141affcc43964" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "bp_services" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "key" character varying NOT NULL, "description" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a363bd6017dffd534f60690eff2" UNIQUE ("key"), CONSTRAINT "PK_c363b40a67d3d1b6f6fbcc4b444" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_assignments" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "assigneeId" character varying NOT NULL, "assigneeName" character varying, "assignmentType" character varying NOT NULL, CONSTRAINT "PK_b68f42cf36d807d8a19a96066d7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_handlers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "instanceId" uuid NOT NULL, "handlerUserId" character varying, "handlerUser" jsonb NOT NULL DEFAULT '{}', "previousHandlerId" character varying, "pickedAt" TIMESTAMP, "data" jsonb, "currentState" character varying NOT NULL, "assignmentStatus" character varying NOT NULL DEFAULT 'Unpicked', CONSTRAINT "REL_55dc9b76aa5f000b2c76701827" UNIQUE ("instanceId"), CONSTRAINT "PK_0b5474cb0a041cb84e39ab5d77a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "label" character varying, "description" text, "bpId" uuid NOT NULL, "handlerType" character varying NOT NULL, "orderBy" integer NOT NULL DEFAULT '1', "taskType" character varying NOT NULL, "checkList" jsonb, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "business_processes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceId" uuid NOT NULL, "workflow" jsonb NOT NULL, "version" integer NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "organizationId" character varying, "organizationName" character varying, CONSTRAINT "PK_55db7a27b5949d358018944b3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_trackers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taskId" uuid NOT NULL, "instanceId" uuid NOT NULL, "data" jsonb, "handlerUserId" character varying, "handlerUser" jsonb, "pickedAt" TIMESTAMP, "action" character varying NOT NULL, "remark" character varying, "previousHandlerId" character varying, "checklists" jsonb, "executedAt" TIMESTAMP, CONSTRAINT "PK_4a2d9baad0278dde8c1cf7f5757" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "isr_vendors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "tinNumber" character varying, "status" character varying NOT NULL DEFAULT 'Active', "initial" jsonb NOT NULL, "basic" jsonb NOT NULL, "address" jsonb, "contactPersons" jsonb, "businessSizeAndOwnership" jsonb, "shareHolders" jsonb, "beneficialOwnership" jsonb, "bankAccountDetails" jsonb, "areasOfBusinessInterest" jsonb, "invoice" jsonb, "supportingDocuments" jsonb, "paymentReceipt" jsonb, "remark" character varying, CONSTRAINT "PK_b524d9d8432cbfbd59d5ff480b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "workflow_instances" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "applicationNumber" character varying NOT NULL, "requestorId" uuid, "user" jsonb, "userId" character varying, "status" character varying NOT NULL DEFAULT 'Submitted', "bpId" uuid NOT NULL, "serviceId" character varying, "businessStatus" character varying, "submittedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "pricingId" uuid, CONSTRAINT "PK_90cc94e44ff8b7b7869f50e4fc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendors" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tin" character varying, "userId" character varying NOT NULL, "isrVendorId" uuid, "status" character varying NOT NULL DEFAULT 'draft', "formOfEntity" character varying, "country" character varying NOT NULL DEFAULT 'Malian', "metaData" json, "name" character varying, "level" character varying, "origin" character varying, "district" character varying, CONSTRAINT "UQ_8366b7307aa27f4e8fe89a018ff" UNIQUE ("tin"), CONSTRAINT "REL_ffb6cf8b48347b97ccf9d51c3d" UNIQUE ("isrVendorId"), CONSTRAINT "PK_9c956c9797edfae5c6ddacc4e6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "vendors_bank" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountHolderFullName" character varying NOT NULL, "accountNumber" character varying NOT NULL, "vendorId" uuid, "bankId" uuid NOT NULL, "branchName" character varying NOT NULL, "branchAddress" character varying, "currency" character varying, "bankSwift" character varying, "IBAN" character varying, "status" character varying, "hashValue" character varying, "bankName" character varying, "metaData" jsonb, "accountType" character varying, "isDefualt" boolean, CONSTRAINT "PK_28b2ab5aa6d0506e58a24baf32a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "bankName" character varying, "metaData" jsonb, CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "files" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileName" character varying NOT NULL, "fileType" character varying NOT NULL, "bucketName" character varying NOT NULL, "originalName" character varying NOT NULL, "attachmentUrl" character varying, "path" character varying NOT NULL, "vendorId" character varying NOT NULL, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "instanceId" uuid, "applicationNo" character varying, "pricingId" character varying, "taskName" character varying, "taskId" uuid, "serviceName" character varying NOT NULL, "payerName" character varying NOT NULL, "payerAccountId" character varying NOT NULL, "payToAccNo" character varying NOT NULL, "payToAccName" character varying NOT NULL, "payToBank" character varying NOT NULL, "amount" numeric NOT NULL, "createdOn" TIMESTAMP NOT NULL, "paymentStatus" character varying NOT NULL, "remark" character varying NOT NULL, "attachment" character varying, CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "receipts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "invoiceId" uuid NOT NULL, "referenceNumber" character varying NOT NULL, "remark" character varying NOT NULL, "filePath" character varying, "fileType" character varying, CONSTRAINT "REL_12367eb1bc0e7fb308bc571430" UNIQUE ("invoiceId"), CONSTRAINT "PK_5e8182d7c29e023da6e1ff33bfe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_232576669c4df1f0a15e1300ce2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shareholders" ADD CONSTRAINT "FK_59629b022dc24fded18674d27b3" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "custom_categories" ADD CONSTRAINT "FK_ad4063959f338df8e0649c704e8" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_ccde635bce518afe7c110858cc4" FOREIGN KEY ("parentCategoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business_categories" ADD CONSTRAINT "FK_24641c3aafa3d295b5b3a329af0" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business_categories" ADD CONSTRAINT "FK_4b0c6f9bbf3008476dc8b4ec312" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "beneficial_ownership" ADD CONSTRAINT "FK_a3fff4c50177836bd15a18fe0d3" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" ADD CONSTRAINT "FK_dd0fe1df57d88af04faa025ac88" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_pricing" ADD CONSTRAINT "FK_e34b51a6faa8f40d89c3f4b343c" FOREIGN KEY ("serviceId") REFERENCES "bp_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_assignments" ADD CONSTRAINT "FK_a5f6f6ce5f13705ff2b24d5cc2c" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_handlers" ADD CONSTRAINT "FK_55dc9b76aa5f000b2c767018272" FOREIGN KEY ("instanceId") REFERENCES "workflow_instances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_handlers" ADD CONSTRAINT "FK_afdd0c0653900af3f44c3880925" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_3c4618e651f484a1d2ccba463f3" FOREIGN KEY ("bpId") REFERENCES "business_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "business_processes" ADD CONSTRAINT "FK_e72b033fc23fd01a3205cec53eb" FOREIGN KEY ("serviceId") REFERENCES "bp_services"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "task_trackers" ADD CONSTRAINT "FK_699713294acc54eeff79e475768" FOREIGN KEY ("instanceId") REFERENCES "workflow_instances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_trackers" ADD CONSTRAINT "FK_98facc429043a9548110b0cdeb8" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" ADD CONSTRAINT "FK_e41507c2cbd0bca1ea3225cb8e6" FOREIGN KEY ("bpId") REFERENCES "business_processes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" ADD CONSTRAINT "FK_d4e1031259ad95ca1bb593200df" FOREIGN KEY ("pricingId") REFERENCES "service_pricing"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" ADD CONSTRAINT "FK_40751c4f7424c4ffb7430332375" FOREIGN KEY ("requestorId") REFERENCES "isr_vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendors" ADD CONSTRAINT "FK_ffb6cf8b48347b97ccf9d51c3d0" FOREIGN KEY ("isrVendorId") REFERENCES "isr_vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendors_bank" ADD CONSTRAINT "FK_33cd9d2ec8df03e3470952c25f5" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "vendors_bank" ADD CONSTRAINT "FK_eba3b410944a08e26a78ff4318d" FOREIGN KEY ("bankId") REFERENCES "banks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "receipts" ADD CONSTRAINT "FK_12367eb1bc0e7fb308bc5714301" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "receipts" DROP CONSTRAINT "FK_12367eb1bc0e7fb308bc5714301"`);
        await queryRunner.query(`ALTER TABLE "vendors_bank" DROP CONSTRAINT "FK_eba3b410944a08e26a78ff4318d"`);
        await queryRunner.query(`ALTER TABLE "vendors_bank" DROP CONSTRAINT "FK_33cd9d2ec8df03e3470952c25f5"`);
        await queryRunner.query(`ALTER TABLE "vendors" DROP CONSTRAINT "FK_ffb6cf8b48347b97ccf9d51c3d0"`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" DROP CONSTRAINT "FK_40751c4f7424c4ffb7430332375"`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" DROP CONSTRAINT "FK_d4e1031259ad95ca1bb593200df"`);
        await queryRunner.query(`ALTER TABLE "workflow_instances" DROP CONSTRAINT "FK_e41507c2cbd0bca1ea3225cb8e6"`);
        await queryRunner.query(`ALTER TABLE "task_trackers" DROP CONSTRAINT "FK_98facc429043a9548110b0cdeb8"`);
        await queryRunner.query(`ALTER TABLE "task_trackers" DROP CONSTRAINT "FK_699713294acc54eeff79e475768"`);
        await queryRunner.query(`ALTER TABLE "business_processes" DROP CONSTRAINT "FK_e72b033fc23fd01a3205cec53eb"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_3c4618e651f484a1d2ccba463f3"`);
        await queryRunner.query(`ALTER TABLE "task_handlers" DROP CONSTRAINT "FK_afdd0c0653900af3f44c3880925"`);
        await queryRunner.query(`ALTER TABLE "task_handlers" DROP CONSTRAINT "FK_55dc9b76aa5f000b2c767018272"`);
        await queryRunner.query(`ALTER TABLE "task_assignments" DROP CONSTRAINT "FK_a5f6f6ce5f13705ff2b24d5cc2c"`);
        await queryRunner.query(`ALTER TABLE "service_pricing" DROP CONSTRAINT "FK_e34b51a6faa8f40d89c3f4b343c"`);
        await queryRunner.query(`ALTER TABLE "business_interest_area" DROP CONSTRAINT "FK_dd0fe1df57d88af04faa025ac88"`);
        await queryRunner.query(`ALTER TABLE "beneficial_ownership" DROP CONSTRAINT "FK_a3fff4c50177836bd15a18fe0d3"`);
        await queryRunner.query(`ALTER TABLE "business_categories" DROP CONSTRAINT "FK_4b0c6f9bbf3008476dc8b4ec312"`);
        await queryRunner.query(`ALTER TABLE "business_categories" DROP CONSTRAINT "FK_24641c3aafa3d295b5b3a329af0"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_ccde635bce518afe7c110858cc4"`);
        await queryRunner.query(`ALTER TABLE "custom_categories" DROP CONSTRAINT "FK_ad4063959f338df8e0649c704e8"`);
        await queryRunner.query(`ALTER TABLE "shareholders" DROP CONSTRAINT "FK_59629b022dc24fded18674d27b3"`);
        await queryRunner.query(`DROP TABLE "task_types"`);
        await queryRunner.query(`DROP TABLE "receipts"`);
        await queryRunner.query(`DROP TABLE "invoice"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TABLE "banks"`);
        await queryRunner.query(`DROP TABLE "vendors_bank"`);
        await queryRunner.query(`DROP TABLE "vendors"`);
        await queryRunner.query(`DROP TABLE "workflow_instances"`);
        await queryRunner.query(`DROP TABLE "isr_vendors"`);
        await queryRunner.query(`DROP TABLE "task_trackers"`);
        await queryRunner.query(`DROP TABLE "business_processes"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "task_handlers"`);
        await queryRunner.query(`DROP TABLE "task_assignments"`);
        await queryRunner.query(`DROP TABLE "bp_services"`);
        await queryRunner.query(`DROP TABLE "service_pricing"`);
        await queryRunner.query(`DROP TABLE "business_interest_area"`);
        await queryRunner.query(`DROP TABLE "beneficial_ownership"`);
        await queryRunner.query(`DROP TABLE "business_categories"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "custom_categories"`);
        await queryRunner.query(`DROP TABLE "shareholders"`);
    }

}
