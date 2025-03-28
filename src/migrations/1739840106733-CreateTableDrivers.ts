import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableDrivers1739840106733 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: "drivers",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "full_address",
                        type: "varchar",
                        length: "255",
                        isNullable: false,
                    },
                    {
                        name: "document",
                        type: "varchar",
                        length: "30",
                        isNullable: false,
                    },
                    {
                        name: "user_id",
                        type: "int",
                        isNullable: false,
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                ],         
            }),
            true
        );

          await queryRunner.createForeignKey("drivers", new TableForeignKey({
                    columnNames: ["user_id"],
                    referencedColumnNames: ["id"],
                    referencedTableName: "users",            
                    onDelete: 'CASCADE',       
                }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("drivers");
    }
}