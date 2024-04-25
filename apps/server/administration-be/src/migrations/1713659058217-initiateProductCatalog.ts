import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitiateProductCatalog1713659058217 implements MigrationInterface {
  name = 'InitiateProductCatalog1713659058217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "specification_templates" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "organizationId" uuid NOT NULL, "organizationName" character varying NOT NULL DEFAULT 'DefaultOrganization', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemMasterId" uuid NOT NULL, "quantity" numeric(14,2) NOT NULL DEFAULT '0', "properties" jsonb NOT NULL, "deliveries" jsonb NOT NULL, CONSTRAINT "REL_3c7f81573604c78cc15364ebdb" UNIQUE ("itemMasterId"), CONSTRAINT "PK_9bebd78db4b3b098016b05eb7b3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_catalog_images" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fileInfo" jsonb NOT NULL, "productCatalogId" uuid NOT NULL, CONSTRAINT "PK_5188f5af6ec797065420b388704" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_catalogs_status_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."product_catalogs_approvalstatus_enum" AS ENUM('Submitted', 'Approved', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_catalogs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemMasterId" uuid NOT NULL, "vendor" jsonb NOT NULL, "specificationTemplateId" uuid NOT NULL, "specificationValues" jsonb NOT NULL, "deliveryValues" jsonb NOT NULL, "quantity" numeric(14,2) NOT NULL DEFAULT '0', "status" "public"."product_catalogs_status_enum" NOT NULL DEFAULT 'Active', "approvalStatus" "public"."product_catalogs_approvalstatus_enum" NOT NULL DEFAULT 'Submitted', CONSTRAINT "REL_fc73516c0f262d53d3e7f3f44d" UNIQUE ("itemMasterId"), CONSTRAINT "PK_16637c7d65f5806c7c5052bb0f1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "specification_templates" ADD CONSTRAINT "FK_3c7f81573604c78cc15364ebdba" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalog_images" ADD CONSTRAINT "FK_c338e6268ebe6f4d9d16f3d7ce6" FOREIGN KEY ("productCatalogId") REFERENCES "product_catalogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD CONSTRAINT "FK_fc73516c0f262d53d3e7f3f44d3" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD CONSTRAINT "FK_0ff3370f8ab1b3bdd3f57df5e39" FOREIGN KEY ("specificationTemplateId") REFERENCES "specification_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP CONSTRAINT "FK_0ff3370f8ab1b3bdd3f57df5e39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP CONSTRAINT "FK_fc73516c0f262d53d3e7f3f44d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalog_images" DROP CONSTRAINT "FK_c338e6268ebe6f4d9d16f3d7ce6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specification_templates" DROP CONSTRAINT "FK_3c7f81573604c78cc15364ebdba"`,
    );
    await queryRunner.query(`DROP TABLE "product_catalogs"`);
    await queryRunner.query(
      `DROP TYPE "public"."product_catalogs_approvalstatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."product_catalogs_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "product_catalog_images"`);
    await queryRunner.query(`DROP TABLE "specification_templates"`);
  }
}
