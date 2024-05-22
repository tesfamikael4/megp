import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeRelationship1716385546548 implements MigrationInterface {
  name = 'ChangeRelationship1716385546548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP CONSTRAINT "FK_fc73516c0f262d53d3e7f3f44d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP CONSTRAINT "REL_fc73516c0f262d53d3e7f3f44d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD CONSTRAINT "FK_fc73516c0f262d53d3e7f3f44d3" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" DROP CONSTRAINT "FK_fc73516c0f262d53d3e7f3f44d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD CONSTRAINT "REL_fc73516c0f262d53d3e7f3f44d" UNIQUE ("itemMasterId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_catalogs" ADD CONSTRAINT "FK_fc73516c0f262d53d3e7f3f44d3" FOREIGN KEY ("itemMasterId") REFERENCES "item_masters"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
  }
}
