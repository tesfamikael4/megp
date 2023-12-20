import { MigrationInterface, QueryRunner } from 'typeorm';

export class RegionDistrictTgroup1702388721135 implements MigrationInterface {
  name = 'RegionDistrictTgroup1702388721135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "regions" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "districts" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "regionId" uuid NOT NULL, CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "target_groups" ("tenantId" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_73042b184f2c7b5f2c2bf28311d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "currencies" ADD "abbreviation" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" ADD CONSTRAINT "UQ_ecda7925be57c32d6f988ac50b6" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" ADD CONSTRAINT "UQ_3883df5dc1cc11bf06655d3c67b" UNIQUE ("shortName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" ADD CONSTRAINT "UQ_8198537f6649564e143f23d4288" UNIQUE ("name")`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" ADD CONSTRAINT "UQ_431f375e3bb7924c86acb7be152" UNIQUE ("shortName")`,
    );
    await queryRunner.query(
      `ALTER TABLE "districts" ADD CONSTRAINT "FK_22aacab5f414aec89d486bacbb0" FOREIGN KEY ("regionId") REFERENCES "regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "districts" DROP CONSTRAINT "FK_22aacab5f414aec89d486bacbb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" DROP CONSTRAINT "UQ_431f375e3bb7924c86acb7be152"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unit_of_measurements" DROP CONSTRAINT "UQ_8198537f6649564e143f23d4288"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" DROP CONSTRAINT "UQ_3883df5dc1cc11bf06655d3c67b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "measurements" DROP CONSTRAINT "UQ_ecda7925be57c32d6f988ac50b6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "currencies" DROP COLUMN "abbreviation"`,
    );
    await queryRunner.query(`DROP TABLE "target_groups"`);
    await queryRunner.query(`DROP TABLE "districts"`);
    await queryRunner.query(`DROP TABLE "regions"`);
  }
}
