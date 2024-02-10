import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeleteAtAtributeForAll1703667231789 implements MigrationInterface {
  name = 'DeleteAtAtributeForAll1703667231789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "shareholders" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "beneficial_ownership" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_pricing" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "bp_services" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "business_processes" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "vendors" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "files" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "message_templates" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "deletedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_preferences" ADD "deletedAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_preferences" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message_templates" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "vendors" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "business_processes" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_assignments" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "bp_services" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_pricing" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "isr_vendors" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "beneficial_ownership" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendors_bank" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shareholders" DROP COLUMN "deletedAt"`,
    );
  }
}
