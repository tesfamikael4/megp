import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1699771996334 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('');
  }
}
