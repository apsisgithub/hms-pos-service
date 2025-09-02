import { MigrationInterface, QueryRunner } from "typeorm";
import { TransactionService } from "../src/common/query-manager/query.service";

export class AddPaymentAndChargesTable1754908424875 implements MigrationInterface {
    name = 'AddPaymentAndChargesTable1754908424875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const transactionService = new TransactionService(queryRunner);

        // Create master_payments table
        await transactionService.query(`CREATE TABLE \`master_payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`ref_no\` int NULL, \`transaction_id\` varchar(36) NOT NULL, \`sbu_id\` int NOT NULL, \`reservation_id\` int NULL, \`currency_id\` int NULL, \`credit_card_id\` int NULL, \`payment_mode_id\` int NOT NULL, \`paid_amount\` decimal(12,2) NOT NULL, \`paid_date\` date NULL, \`payment_status\` enum ('pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'chargeback', 'expired', 'cancelled') NOT NULL DEFAULT 'paid', \`description\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_a4a33e25e466ca3e6ebf75c150\` (\`transaction_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);

        // Create master_charges table
        await transactionService.query(`CREATE TABLE \`master_charges\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`ref_no\` int NULL, \`sbu_id\` int NOT NULL, \`reservation_id\` int NULL, \`room_id\` int NULL, \`amount\` decimal(12,2) NOT NULL, \`description\` varchar(255) NOT NULL, \`type\` enum ('RoomCharges', 'AirportPickup', 'BreakfastWithLunchOrDinner', 'Damage') NOT NULL, \`posting_type\` enum ('CheckInAndCheckOut', 'EveryDay', 'EveryDayExceptCheckIn', 'EveryDayExceptCheckInAndCheckOut', 'EveryDayExceptCheckOut', 'CustomDate', 'CheckOut') NOT NULL, \`charge_rule\` enum ('PerAdult', 'PerBooking', 'PerChild', 'PerPerson', 'PerQuanity') NOT NULL, \`is_tax_included\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);

        // Add foreign key constraints
        await transactionService.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_84aff9385ee0d6305caaae03e09\` FOREIGN KEY (\`credit_card_id\`) REFERENCES \`master_credit_cards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await transactionService.query(`ALTER TABLE \`master_charges\` ADD CONSTRAINT \`FK_8adbe07a8833b02d645d52d0886\` FOREIGN KEY (\`sbu_id\`) REFERENCES \`master_sbu\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await transactionService.query(`ALTER TABLE \`master_charges\` ADD CONSTRAINT \`FK_a90a51c2f91e791a7eb39322d0c\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await transactionService.query(`ALTER TABLE \`master_charges\` ADD CONSTRAINT \`FK_6c4e751338565e88f473c2d46cc\` FOREIGN KEY (\`room_id\`) REFERENCES \`master_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
