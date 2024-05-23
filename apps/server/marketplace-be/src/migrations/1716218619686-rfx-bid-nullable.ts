import { MigrationInterface, QueryRunner } from 'typeorm';

export class RfxBidNullable1716218619686 implements MigrationInterface {
  name = 'RfxBidNullable1716218619686';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "roundDuration" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD "invitationId" uuid NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "sol_offers" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD "price" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "UQ_a3ba29e19163067848d85664095"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "UQ_dcc2e8b7db7adee7b05b48a8e2a" UNIQUE ("rfxItemId", "vendorId", "roundId", "invitationId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "FK_7c02f9586af7339e7e026c7cd2b" FOREIGN KEY ("invitationId") REFERENCES "rfx_bid_invitations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" ADD CONSTRAINT "UQ_9bde8c18a8d72c14733a8a4e8f9" UNIQUE ("rfxId", "round")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "sol_rounds" DROP CONSTRAINT "UQ_9bde8c18a8d72c14733a8a4e8f9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "FK_7c02f9586af7339e7e026c7cd2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP CONSTRAINT "UQ_dcc2e8b7db7adee7b05b48a8e2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD CONSTRAINT "UQ_a3ba29e19163067848d85664095" UNIQUE ("rfxItemId", "vendorId", "roundId")`,
    );
    await queryRunner.query(`ALTER TABLE "sol_offers" DROP COLUMN "price"`);
    await queryRunner.query(
      `ALTER TABLE "sol_offers" ADD "price" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "sol_offers" DROP COLUMN "invitationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rfx_bid_procedures" ALTER COLUMN "roundDuration" SET NOT NULL`,
    );
  }
}
