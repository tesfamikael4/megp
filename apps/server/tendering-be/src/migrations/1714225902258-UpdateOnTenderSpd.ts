import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateOnTenderSpd1714225902258 implements MigrationInterface {
  name = 'UpdateOnTenderSpd1714225902258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "REL_4221467b4b3a879ae8e9295f94"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tender_spds" DROP CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "REL_4221467b4b3a879ae8e9295f94" UNIQUE ("spdId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tender_spds" ADD CONSTRAINT "FK_4221467b4b3a879ae8e9295f94c" FOREIGN KEY ("spdId") REFERENCES "spd"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
