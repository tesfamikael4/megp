import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntialContarctCatalog1714016725945 implements MigrationInterface {
  name = 'IntialContarctCatalog1714016725945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."contract_allocated_items_status_enum" AS ENUM('Active', 'Inactive', 'Utilized', 'Cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract_allocated_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contractItemId" uuid NOT NULL, "contractBeneficiaryId" uuid NOT NULL, "itemMasterId" uuid NOT NULL, "maximumQuantity" integer NOT NULL, "utilizedQuantity" integer NOT NULL, "status" "public"."contract_allocated_items_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_22b2e18c4a91f7cda3db6722025" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contract_beneficiaries_status_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract_beneficiaries" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contractCatalogId" uuid NOT NULL, "organization" jsonb NOT NULL, "status" "public"."contract_beneficiaries_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_b77f1b2b8e86d3395216d7d4ab1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contract_catalogs_status_enum" AS ENUM('Active', 'Inactive', 'Draft')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract_catalogs" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "organization" jsonb NOT NULL, "vendor" jsonb NOT NULL, "contractReferenceNumber" character varying NOT NULL, "contractTitle" character varying NOT NULL, "description" character varying NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "status" "public"."contract_catalogs_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_2ee42ab94ea1bb87f2a7669d4f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contract_items_status_enum" AS ENUM('Active', 'Inactive', 'Utilized', 'Cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract_items" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contractCatalogId" uuid NOT NULL, "itemMasterId" uuid NOT NULL, "maximumQuantity" integer NOT NULL, "utilizedQuantity" integer NOT NULL, "specification" jsonb NOT NULL, "status" "public"."contract_items_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_490c7394f3b09ee92c41668a156" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contract_item_prices_status_enum" AS ENUM('Active', 'Inactive', 'Utilized', 'Cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract_item_prices" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "contractItemId" uuid NOT NULL, "unitPrice" integer NOT NULL, "location" point NOT NULL, "deliveryDate" TIMESTAMP NOT NULL, "currency" character varying NOT NULL, "applicableTax" character varying NOT NULL, "status" "public"."contract_item_prices_status_enum" NOT NULL DEFAULT 'Active', CONSTRAINT "PK_377698c639d36c111a6c17ed0d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "specification_templates" ALTER COLUMN "organizationName" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_allocated_items" ADD CONSTRAINT "FK_03343bfcdbab567447cd4c23395" FOREIGN KEY ("contractItemId") REFERENCES "contract_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_allocated_items" ADD CONSTRAINT "FK_0b4b587869bd76a3b91f6411ec1" FOREIGN KEY ("contractBeneficiaryId") REFERENCES "contract_beneficiaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" ADD CONSTRAINT "FK_7b7ed2d9440c27f505b7c88cdfc" FOREIGN KEY ("contractCatalogId") REFERENCES "contract_catalogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_items" ADD CONSTRAINT "FK_b6e1977c464f21f7fb4b8225486" FOREIGN KEY ("contractCatalogId") REFERENCES "contract_catalogs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_item_prices" ADD CONSTRAINT "FK_27bd5240672c9d7a76823b531ef" FOREIGN KEY ("contractItemId") REFERENCES "contract_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract_item_prices" DROP CONSTRAINT "FK_27bd5240672c9d7a76823b531ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_items" DROP CONSTRAINT "FK_b6e1977c464f21f7fb4b8225486"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_beneficiaries" DROP CONSTRAINT "FK_7b7ed2d9440c27f505b7c88cdfc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_allocated_items" DROP CONSTRAINT "FK_0b4b587869bd76a3b91f6411ec1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_allocated_items" DROP CONSTRAINT "FK_03343bfcdbab567447cd4c23395"`,
    );
    await queryRunner.query(
      `ALTER TABLE "specification_templates" ALTER COLUMN "organizationName" SET DEFAULT 'DefaultOrganization'`,
    );
    await queryRunner.query(`DROP TABLE "contract_item_prices"`);
    await queryRunner.query(
      `DROP TYPE "public"."contract_item_prices_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "contract_items"`);
    await queryRunner.query(`DROP TYPE "public"."contract_items_status_enum"`);
    await queryRunner.query(`DROP TABLE "contract_catalogs"`);
    await queryRunner.query(
      `DROP TYPE "public"."contract_catalogs_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "contract_beneficiaries"`);
    await queryRunner.query(
      `DROP TYPE "public"."contract_beneficiaries_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "contract_allocated_items"`);
    await queryRunner.query(
      `DROP TYPE "public"."contract_allocated_items_status_enum"`,
    );
  }
}
