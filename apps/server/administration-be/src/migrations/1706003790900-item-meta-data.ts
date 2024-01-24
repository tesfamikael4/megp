import { MigrationInterface, QueryRunner } from 'typeorm';

export class ItemMetaData1706003790900 implements MigrationInterface {
  name = 'ItemMetaData1706003790900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "item_meta_data" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "itemMasterId" uuid NOT NULL, CONSTRAINT "PK_5fb69172ee270a9b62cb35ec0e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" ADD CONSTRAINT "FK_e92844fd4f98c0c4f64882f9b34" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "item_meta_data" DROP CONSTRAINT "FK_e92844fd4f98c0c4f64882f9b34"`,
    );
    await queryRunner.query(`DROP TABLE "item_meta_data"`);
  }
}
