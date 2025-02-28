import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableProduct1740328300136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "products",
            columns: [
              {
                name: "id",
                type: "uuid",
                isPrimary: true,
                generationStrategy: "uuid",
                default: "uuid_generate_v4()",
              },
              {
                name: "name",
                type: "varchar",
                length: "200",
                isNullable: false,
              },
              {
                name: "amount",
                type: "int",
                isNullable: false,
              },
              {
                name: "description",
                type: "varchar",
                length: "200",
                isNullable: false,
              },
              {
                name: "url_cover",
                type: "varchar",
                length: "200",
                isNullable: true,
              },
              {
                name: "branch_id",
                type: "uuid",
                isNullable: false,
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "now()",
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "now()",
              },
            ],
          })
        );
    
        await queryRunner.createForeignKey(
          "products",
          new TableForeignKey({
            columnNames: ["branch_id"],
            referencedTableName: "branches",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("products");
      }
    }