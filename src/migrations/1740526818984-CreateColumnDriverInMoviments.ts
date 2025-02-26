import { MigrationInterface, QueryRunner } from "typeorm";



export class CreateColumnDriverInMoviments1740526818984 implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE movements ADD COLUMN driver_id int`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE movements DROP COLUMN driver_id`);
  }
}