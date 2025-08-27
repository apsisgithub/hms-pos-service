import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveReservationType1754258749288 implements MigrationInterface {
    name = 'RemoveReservationType1754258749288'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_reservations\` DROP FOREIGN KEY \`FK_4ecdecba4dde1452b3977a009dd\``);
        await queryRunner.query(`ALTER TABLE \`master_reservations\` DROP COLUMN \`reservation_type_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_reservations\` ADD \`reservation_type_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_reservations\` ADD CONSTRAINT \`FK_4ecdecba4dde1452b3977a009dd\` FOREIGN KEY (\`reservation_type_id\`) REFERENCES \`master_reservation_types\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
