import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountPhoneUniqueness1712126031472 implements MigrationInterface {
  name = 'AccountPhoneUniqueness1712126031472';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" ADD CONSTRAINT "UQ_41704a57004fc60242d7996bd85" UNIQUE ("phone")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "accounts" DROP CONSTRAINT "UQ_41704a57004fc60242d7996bd85"`,
    );
  }
}
