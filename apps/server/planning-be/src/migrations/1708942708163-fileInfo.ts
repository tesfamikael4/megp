import { MigrationInterface, QueryRunner } from 'typeorm';

export class FileInfo1708942708163 implements MigrationInterface {
  name = 'FileInfo1708942708163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "fileName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "fileType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "bucketName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "originalName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "path"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "fileName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "fileType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "bucketName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "originalName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "path"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "fileInfo" jsonb NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "fileInfo" jsonb NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "fileInfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" DROP COLUMN "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "fileInfo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" DROP COLUMN "title"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "path" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "originalName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "bucketName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "fileType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "pre_budget_activity_documents" ADD "fileName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "path" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "originalName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "bucketName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "fileType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_budget_activity_documents" ADD "fileName" character varying NOT NULL`,
    );
  }
}
