import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMasterFolio1755038348231 implements MigrationInterface {
    name = 'AddMasterFolio1755038348231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_0aa01e20eca82efdd41c814f5ba\` FOREIGN KEY (\`payment_mode_id\`) REFERENCES \`master_payment_modes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_54422931dae1b1690b97c6eca81\` FOREIGN KEY (\`sbu_id\`) REFERENCES \`master_sbu\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_50af7cf119b0b6420b35f6755ce\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_4d0640f48c4fcd612132743f6bc\` FOREIGN KEY (\`currency_id\`) REFERENCES \`master_currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_ced9c5b197dbef3a56bf9ea5ecc\` FOREIGN KEY (\`folio_id\`) REFERENCES \`master_folios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_folios\` ADD CONSTRAINT \`FK_546b1077b2af5ddab1a2f0b0e22\` FOREIGN KEY (\`guest_id\`) REFERENCES \`master_guests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_folios\` ADD CONSTRAINT \`FK_6ae11829fc0d74668897cc4f608\` FOREIGN KEY (\`sbu_id\`) REFERENCES \`master_sbu\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_folios\` ADD CONSTRAINT \`FK_b9f76c8bab66a9021465af82191\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`master_charges\` DROP FOREIGN KEY \`FK_6711291e50c902f43b73e24ba12\``);
        
       
        await queryRunner.query(`ALTER TABLE \`master_charges\` CHANGE \`charge_rule\` \`charge_rule\` enum ('PerAdult', 'PerBooking', 'PerChild', 'PerPerson', 'PerQuanity') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_charges\` CHANGE \`posting_type\` \`posting_type\` enum ('CheckInAndCheckOut', 'EveryDay', 'EveryDayExceptCheckIn', 'EveryDayExceptCheckInAndCheckOut', 'EveryDayExceptCheckOut', 'CustomDate', 'CheckOut') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_charges\` CHANGE \`type\` \`type\` enum ('RoomCharges', 'AirportPickup', 'BreakfastWithLunchOrDinner', 'Damage') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP COLUMN \`folio_id\``);
        await queryRunner.query(`ALTER TABLE \`master_charges\` DROP COLUMN \`folio_id\``);
       
        await queryRunner.query(`DROP INDEX \`IDX_e5da0f48cd45d070a17aca26ac\` ON \`master_folios\``);
        await queryRunner.query(`DROP TABLE \`master_folios\``);
    }

}
