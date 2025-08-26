import { MigrationInterface, QueryRunner } from "typeorm";

export class MasterReservationSourceInfo1754823630713
    implements MigrationInterface
{
    name = "MasterReservationSourceInfo1754823630713";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`reservation_source_info\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`reservation_id\` int NULL, \`market_code_id\` int NULL, \`business_source_id\` int NULL, \`travel_agent_id\` int NULL, \`voucher_no\` varchar(255) NULL, \`commission_plan\` varchar(255) NULL, \`plan_value\` decimal(10,2) NULL, \`company_id\` int NULL, \`sales_person_id\` int NULL, \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active', UNIQUE INDEX \`REL_2ba9a5c409635239b6f5ab59f3\` (\`reservation_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `ALTER TABLE \`reservation_source_info\` ADD CONSTRAINT \`FK_63f5c3b8480be2d4fa12d1efa84\` FOREIGN KEY (\`company_id\`) REFERENCES \`master_companies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`reservation_source_info\` ADD CONSTRAINT \`FK_2ba9a5c409635239b6f5ab59f3f\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`reservation_source_info\` DROP FOREIGN KEY \`FK_2ba9a5c409635239b6f5ab59f3f\``
        );
        await queryRunner.query(
            `ALTER TABLE \`reservation_source_info\` DROP FOREIGN KEY \`FK_63f5c3b8480be2d4fa12d1efa84\``
        );
        await queryRunner.query(
            `DROP INDEX \`REL_2ba9a5c409635239b6f5ab59f3\` ON \`reservation_source_info\``
        );
        await queryRunner.query(`DROP TABLE \`reservation_source_info\``);
    }
}
