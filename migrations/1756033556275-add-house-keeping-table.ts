import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHouseKeepingTable1756033556275 implements MigrationInterface {
    name = 'AddHouseKeepingTable1756033556275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`housekeeping_work_order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`room_id\` int NOT NULL, \`description\` text NOT NULL, \`category\` enum ('clean', 'maintenance', 'repair', 'other') NOT NULL, \`priority\` enum ('high', 'medium', 'low') NOT NULL, \`status\` enum ('new', 'assigned', 'in_progress', 'completed') NOT NULL DEFAULT 'new', \`assign_to\` int NOT NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`remark\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`housekeeping_work_order_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`work_order_id\` int NOT NULL, \`status\` enum ('new', 'assigned', 'in_progress', 'completed') NOT NULL, \`assign_to\` int NULL, \`remark\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
       
        await queryRunner.query(`ALTER TABLE \`housekeeping_work_order_log\` ADD CONSTRAINT \`FK_ed9772b6754995ee67b9f3adf3d\` FOREIGN KEY (\`work_order_id\`) REFERENCES \`housekeeping_work_order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`housekeeping_work_order_log\` DROP FOREIGN KEY \`FK_ed9772b6754995ee67b9f3adf3d\``);
        await queryRunner.query(`DROP TABLE \`housekeeping_work_order_log\``);
        await queryRunner.query(`DROP TABLE \`housekeeping_work_order\``);
    }

}
