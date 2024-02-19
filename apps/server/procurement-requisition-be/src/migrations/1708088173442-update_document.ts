import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDocument1708088173442 implements MigrationInterface {
  name = 'UpdateDocument1708088173442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_95e8f97e178311e7eb65e632897"`,
    );
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "fileName"`);
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "originalName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "filename" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_82e5679ba55008bf3bcb4e7c996" UNIQUE ("filename")`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "originalname" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "documents" DROP COLUMN "originalname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" DROP CONSTRAINT "UQ_82e5679ba55008bf3bcb4e7c996"`,
    );
    await queryRunner.query(`ALTER TABLE "documents" DROP COLUMN "filename"`);
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "originalName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD "fileName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "documents" ADD CONSTRAINT "UQ_95e8f97e178311e7eb65e632897" UNIQUE ("fileName")`,
    );
  }
}
