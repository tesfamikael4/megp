import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableParentId1707803205735 implements MigrationInterface {
  name = 'NullableParentId1707803205735';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `ALTER TABLE "notes" DROP CONSTRAINT "FK_a6d728a29941461d789c7c98f3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ALTER COLUMN "parentId" DROP NOT NULL`,
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
      `ALTER TABLE "notes" ALTER COLUMN "parentId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notes" ADD CONSTRAINT "FK_a6d728a29941461d789c7c98f3d" FOREIGN KEY ("parentId") REFERENCES "notes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ea45633c6234d20ad5786f3042"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_14276ac84c731af797ec142cdc"`,
    );
    await queryRunner.query(`DROP TABLE "notes_closure"`);
  }
}
