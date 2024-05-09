import { MigrationInterface, QueryRunner } from "typeorm";

export class makeUniqueVoteCode1715162369377 implements MigrationInterface {
    name = ' makeUniqueVoteCode1715162369377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ALTER COLUMN "voteCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_3ceed72b8f2a0a2875574e75ac2" UNIQUE ("voteCode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_3ceed72b8f2a0a2875574e75ac2"`);
        await queryRunner.query(`ALTER TABLE "organizations" ALTER COLUMN "voteCode" DROP NOT NULL`);
    }

}
