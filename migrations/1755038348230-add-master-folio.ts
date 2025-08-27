import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMasterFolio1755038348230 implements MigrationInterface {
    name = 'AddMasterFolio1755038348230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`master_folios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`folio_no\` varchar(50) NOT NULL, \`guest_id\` int NOT NULL, \`sbu_id\` int NOT NULL, \`folio_type\` enum ('Guest', 'Company', 'Group Owner') NOT NULL DEFAULT 'Guest', \`reservation_id\` int NOT NULL, UNIQUE INDEX \`IDX_e5da0f48cd45d070a17aca26ac\` (\`folio_no\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
       
        await queryRunner.query(`ALTER TABLE \`master_charges\` ADD \`folio_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD \`folio_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`master_charges\` CHANGE \`type\` \`type\` enum ('RoomCharges', 'AirportPickup', 'BreakfastWithLunchOrDinner', 'Damage', 'BalanceTransfer') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_charges\` CHANGE \`posting_type\` \`posting_type\` enum ('CheckInAndCheckOut', 'EveryDay', 'EveryDayExceptCheckIn', 'EveryDayExceptCheckInAndCheckOut', 'EveryDayExceptCheckOut', 'CustomDate', 'CheckOut') NULL`);
        await queryRunner.query(`ALTER TABLE \`master_charges\` CHANGE \`charge_rule\` \`charge_rule\` enum ('PerAdult', 'PerBooking', 'PerChild', 'PerPerson', 'PerQuanity') NULL`);
        
       
        await queryRunner.query(`ALTER TABLE \`master_charges\` ADD CONSTRAINT \`FK_6711291e50c902f43b73e24ba12\` FOREIGN KEY (\`folio_id\`) REFERENCES \`master_folios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_folios\` DROP FOREIGN KEY \`FK_b9f76c8bab66a9021465af82191\``);
        await queryRunner.query(`ALTER TABLE \`master_folios\` DROP FOREIGN KEY \`FK_6ae11829fc0d74668897cc4f608\``);
        await queryRunner.query(`ALTER TABLE \`master_folios\` DROP FOREIGN KEY \`FK_546b1077b2af5ddab1a2f0b0e22\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_ced9c5b197dbef3a56bf9ea5ecc\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_4d0640f48c4fcd612132743f6bc\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_50af7cf119b0b6420b35f6755ce\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_54422931dae1b1690b97c6eca81\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_0aa01e20eca82efdd41c814f5ba\``);
       
    }

}
