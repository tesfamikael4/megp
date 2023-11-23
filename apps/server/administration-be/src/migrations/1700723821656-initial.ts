import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1700723821656 implements MigrationInterface {
  name = 'Initial1700723821656';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "taxonomy_code_sets" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "version" character varying NOT NULL, CONSTRAINT "PK_9284782a82451049c23ddba6209" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "classifications" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "taxonomyCodeSetId" uuid, "parentCode" character varying, "key" character varying, "code" character varying NOT NULL, "title" character varying, "definition" character varying, "type" character varying, "synonym" character varying, "acronym" character varying, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_c1ff45c45e53ed4f9e6d5e7ccfa" UNIQUE ("code"), CONSTRAINT "PK_58d976e264f75fc0ea006718856" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemMasterId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_bdc3f2833142bfd6d43fefc6bbc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "measurements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "shortName" character varying NOT NULL, CONSTRAINT "PK_3c0e7812563f27fd68e8271661b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "unit_of_measurements" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "shortName" character varying NOT NULL, "measurementId" uuid NOT NULL, "measurementName" character varying, CONSTRAINT "PK_9996fc4d027487fc20e450fe4e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_masters" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "itemCode" character varying NOT NULL, "description" character varying NOT NULL, "commodityCode" character varying NOT NULL, "commodityName" character varying NOT NULL, "itemSubcategoryName" character varying NOT NULL, "uOMId" uuid NOT NULL, "measurementId" character varying NOT NULL, "uOMName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "itemSubcategoryId" uuid, CONSTRAINT "PK_7ef4612454b7d021c2376db25cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "item_categories" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "parentId" character varying, "parentICategoryId" uuid, CONSTRAINT "PK_db3359595abacbe15cf2f89c07e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "classifications" ADD CONSTRAINT "FK_6e7ea8ebd15673577f2e650d6f2" FOREIGN KEY ("parentCode") REFERENCES "classifications"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "classifications" ADD CONSTRAINT "FK_a73e36325d685c0f348096190c5" FOREIGN KEY ("taxonomyCodeSetId") REFERENCES "taxonomy_code_sets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tags" ADD CONSTRAINT "FK_d0d098ba6673fa09f82f8a8bdf2" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tags" ADD CONSTRAINT "FK_442cf78c33b0664c0ec07583e0b" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" ADD CONSTRAINT "FK_0eb543c331a75394976b6a5f054" FOREIGN KEY ("measurementId") REFERENCES "measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD CONSTRAINT "FK_a729dee3c492d6501e38ac2bead" FOREIGN KEY ("itemSubcategoryId") REFERENCES "item_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" ADD CONSTRAINT "FK_cd8613ad26a5992702516894dab" FOREIGN KEY ("uOMId") REFERENCES "unit_of_measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_categories" ADD CONSTRAINT "FK_df4d3c5a130dc5807ad9b5b8624" FOREIGN KEY ("parentICategoryId") REFERENCES "item_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_categories" DROP CONSTRAINT "FK_df4d3c5a130dc5807ad9b5b8624"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP CONSTRAINT "FK_cd8613ad26a5992702516894dab"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_masters" DROP CONSTRAINT "FK_a729dee3c492d6501e38ac2bead"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" DROP CONSTRAINT "FK_0eb543c331a75394976b6a5f054"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tags" DROP CONSTRAINT "FK_442cf78c33b0664c0ec07583e0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_tags" DROP CONSTRAINT "FK_d0d098ba6673fa09f82f8a8bdf2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classifications" DROP CONSTRAINT "FK_a73e36325d685c0f348096190c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "classifications" DROP CONSTRAINT "FK_6e7ea8ebd15673577f2e650d6f2"`,
    );
    await queryRunner.query(`DROP TABLE "item_categories"`);
    await queryRunner.query(`DROP TABLE "item_masters"`);
    await queryRunner.query(`DROP TABLE "unit_of_measurements"`);
    await queryRunner.query(`DROP TABLE "measurements"`);
    await queryRunner.query(`DROP TABLE "item_tags"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "classifications"`);
    await queryRunner.query(`DROP TABLE "taxonomy_code_sets"`);
  }
}
