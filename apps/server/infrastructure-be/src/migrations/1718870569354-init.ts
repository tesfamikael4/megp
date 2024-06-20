import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1718870569354 implements MigrationInterface {
  name = 'Init1718870569354';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "steps" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "title" character varying NOT NULL, "activityId" uuid NOT NULL, "approvers" jsonb NOT NULL, "type" character varying NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_65f86ac8996204d11f915f66a5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "workflows" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_5b5757cc1cd86268019fef52e0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "permissions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "permissionId" character varying NOT NULL, "activityId" uuid NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "instance_steps" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "title" character varying NOT NULL, "activityId" uuid NOT NULL, "approvers" jsonb NOT NULL, "type" character varying NOT NULL, "order" integer NOT NULL, "itemId" character varying NOT NULL, CONSTRAINT "PK_0ed94e16793581f6e5fa9a37744" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "instances" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityId" uuid NOT NULL, "instanceStepId" uuid, "stateId" uuid NOT NULL, "status" character varying NOT NULL, "itemName" character varying NOT NULL, "itemId" uuid NOT NULL, "version" integer NOT NULL DEFAULT '1', "metadata" jsonb NOT NULL, CONSTRAINT "REL_c5218b7eead88f9ed5329deea5" UNIQUE ("stateId"), CONSTRAINT "PK_11862209053330b4765f7f54178" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "default_steps" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "title" character varying NOT NULL, "activityId" uuid NOT NULL, "type" character varying NOT NULL DEFAULT 'default', "order" integer NOT NULL, CONSTRAINT "PK_5e776ccb71fd9c48837319e233e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "activities" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "title" character varying NOT NULL, "workflowId" uuid NOT NULL, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "states" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "activityId" uuid NOT NULL, "state" jsonb NOT NULL, CONSTRAINT "PK_09ab30ca0975c02656483265f4f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "possible_reasons" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reason" character varying NOT NULL, "designerId" uuid NOT NULL, CONSTRAINT "UQ_bb8cd8789b1ab55064e743b8765" UNIQUE ("reason", "designerId"), CONSTRAINT "PK_9691cc227d246e805dd3b033d90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rule_designer_enforcementmethod_enum" AS ENUM('MANDATORY', 'OPTIONAL', 'FLAG')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_designer" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "enforcementMethod" "public"."rule_designer_enforcementmethod_enum" NOT NULL DEFAULT 'OPTIONAL', "actions" jsonb NOT NULL, "defaultActions" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "UQ_382840e33f64ccf0fbf9a9f8e7f" UNIQUE ("key"), CONSTRAINT "PK_540b4b72c7641babdf0cfce539e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rules" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "designerId" uuid NOT NULL, "executionOrder" integer NOT NULL, "conditions" jsonb NOT NULL, CONSTRAINT "UQ_f2ce86bfe9dbf7eade88605a803" UNIQUE ("key", "designerId"), CONSTRAINT "PK_10fef696a7d61140361b1b23608" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."rule_handlers_type_enum" AS ENUM('CONDITION', 'ACTION')`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_handlers" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "type" "public"."rule_handlers_type_enum" NOT NULL DEFAULT 'CONDITION', CONSTRAINT "UQ_bb4025654e5e4d4824b6eea3bf5" UNIQUE ("key"), CONSTRAINT "PK_c33fbf627657c5eb560ee7bc33b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rule_handler_options" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "value" text, "dataType" character varying, "ruleHandlerId" uuid NOT NULL, CONSTRAINT "UQ_760b4a431a03d03258483a71f6e" UNIQUE ("key"), CONSTRAINT "PK_4397231ca90de1de988e361c75c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_invoices_type_enum" AS ENUM('ONLINE', 'OFFLINE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_invoices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."payment_invoices_type_enum" NOT NULL DEFAULT 'ONLINE', "applicationKey" character varying NOT NULL, "service" character varying NOT NULL, "description" character varying NOT NULL, "amount" numeric(14,2) NOT NULL, "currency" character varying NOT NULL, "invoiceReference" character varying NOT NULL, "sessionId" character varying, "bankReferenceNumber" character varying, "orderId" character varying NOT NULL, "notificationUrl" character varying, "callbackUrl" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "UQ_a926ccdcd8e075d3c9b572a2ba9" UNIQUE ("invoiceReference"), CONSTRAINT "UQ_efaa7ebbcfb3be0fdf32173da8f" UNIQUE ("sessionId"), CONSTRAINT "UQ_fe9678ce6b59f78eb02e839064c" UNIQUE ("bankReferenceNumber"), CONSTRAINT "UQ_080ddf1630c5ecc8098ce04cde5" UNIQUE ("orderId"), CONSTRAINT "PK_41d5ecc2ca516ca9c179f0f0065" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('EMAIL', 'MESSAGE', 'INBOX')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('SUCCEED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."notifications_type_enum" NOT NULL, "application" character varying NOT NULL, "subject" character varying NOT NULL, "detailContent" character varying NOT NULL, "shortContent" character varying NOT NULL, "receiver" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "cc" text, "status" "public"."notifications_status_enum" NOT NULL, "errorMessage" character varying, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "objectId" uuid NOT NULL, "objectType" character varying NOT NULL, "parentId" uuid, "content" text NOT NULL, "metaData" jsonb NOT NULL, "key" character varying NOT NULL, CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notes_closure" ("id_ancestor" uuid NOT NULL, "id_descendant" uuid NOT NULL, CONSTRAINT "PK_6a46a9147b45fa08e93256aa8e9" PRIMARY KEY ("id_ancestor", "id_descendant"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_14276ac84c731af797ec142cdc" ON "notes_closure" ("id_ancestor") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ea45633c6234d20ad5786f3042" ON "notes_closure" ("id_descendant") `,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" ADD CONSTRAINT "FK_ae5610f0c2355ba090363087343" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" ADD CONSTRAINT "FK_dd9d0902bb6bf199152e8ca5bbd" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instance_steps" ADD CONSTRAINT "FK_e7288531c65e9072590e0572f4a" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_6972278b42de1df61ff204a0780" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_a6cffc72cfb0959f7adf95e076a" FOREIGN KEY ("instanceStepId") REFERENCES "instance_steps"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" ADD CONSTRAINT "FK_c5218b7eead88f9ed5329deea5c" FOREIGN KEY ("stateId") REFERENCES "states"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" ADD CONSTRAINT "FK_6497d31ce37e394a2e3fdfa3f38" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_8031d136fb2c73a8dbc10341ef1" FOREIGN KEY ("workflowId") REFERENCES "workflows"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" ADD CONSTRAINT "FK_6bfa9eb0d77ac638ec0500d280d" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" ADD CONSTRAINT "FK_ed7b12726835d030e1976a7adad" FOREIGN KEY ("designerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" ADD CONSTRAINT "FK_15b285243d51705061f39df0a48" FOREIGN KEY ("designerId") REFERENCES "rule_designer"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_handler_options" ADD CONSTRAINT "FK_e3228adb12575f5116c198c8b3c" FOREIGN KEY ("ruleHandlerId") REFERENCES "rule_handlers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_a6d728a29941461d789c7c98f3d" FOREIGN KEY ("parentId") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes_closure" ADD CONSTRAINT "FK_14276ac84c731af797ec142cdce" FOREIGN KEY ("id_ancestor") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes_closure" ADD CONSTRAINT "FK_ea45633c6234d20ad5786f30426" FOREIGN KEY ("id_descendant") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notes_closure" DROP CONSTRAINT "FK_ea45633c6234d20ad5786f30426"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes_closure" DROP CONSTRAINT "FK_14276ac84c731af797ec142cdce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_a6d728a29941461d789c7c98f3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rule_handler_options" DROP CONSTRAINT "FK_e3228adb12575f5116c198c8b3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rules" DROP CONSTRAINT "FK_15b285243d51705061f39df0a48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "possible_reasons" DROP CONSTRAINT "FK_ed7b12726835d030e1976a7adad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "states" DROP CONSTRAINT "FK_6bfa9eb0d77ac638ec0500d280d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_8031d136fb2c73a8dbc10341ef1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "default_steps" DROP CONSTRAINT "FK_6497d31ce37e394a2e3fdfa3f38"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_c5218b7eead88f9ed5329deea5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_a6cffc72cfb0959f7adf95e076a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instances" DROP CONSTRAINT "FK_6972278b42de1df61ff204a0780"`,
    );
    await queryRunner.query(
      `ALTER TABLE "instance_steps" DROP CONSTRAINT "FK_e7288531c65e9072590e0572f4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "permissions" DROP CONSTRAINT "FK_dd9d0902bb6bf199152e8ca5bbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "steps" DROP CONSTRAINT "FK_ae5610f0c2355ba090363087343"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ea45633c6234d20ad5786f3042"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_14276ac84c731af797ec142cdc"`,
    );
    await queryRunner.query(`DROP TABLE "notes_closure"`);
    await queryRunner.query(`DROP TABLE "notes"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "payment_invoices"`);
    await queryRunner.query(`DROP TYPE "public"."payment_invoices_type_enum"`);
    await queryRunner.query(`DROP TABLE "rule_handler_options"`);
    await queryRunner.query(`DROP TABLE "rule_handlers"`);
    await queryRunner.query(`DROP TYPE "public"."rule_handlers_type_enum"`);
    await queryRunner.query(`DROP TABLE "rules"`);
    await queryRunner.query(`DROP TABLE "rule_designer"`);
    await queryRunner.query(
      `DROP TYPE "public"."rule_designer_enforcementmethod_enum"`,
    );
    await queryRunner.query(`DROP TABLE "possible_reasons"`);
    await queryRunner.query(`DROP TABLE "states"`);
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(`DROP TABLE "default_steps"`);
    await queryRunner.query(`DROP TABLE "instances"`);
    await queryRunner.query(`DROP TABLE "instance_steps"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
    await queryRunner.query(`DROP TABLE "workflows"`);
    await queryRunner.query(`DROP TABLE "steps"`);
  }
}
