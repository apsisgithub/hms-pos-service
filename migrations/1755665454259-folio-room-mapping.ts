import { MigrationInterface, QueryRunner } from "typeorm";

export class FolioRoomMapping1755665454259 implements MigrationInterface {
    name = "FolioRoomMapping1755665454259";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`folios_rooms_mapping\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`folio_id\` int NOT NULL, \`room_id\` int NOT NULL, \`reservation_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );

        await queryRunner.query(
            `ALTER TABLE \`template_placeholders\` ADD \`filter_key\` varchar(255) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`folios_rooms_mapping\` ADD CONSTRAINT \`FK_b74e465b2d76f72f9de02bf683e\` FOREIGN KEY (\`folio_id\`) REFERENCES \`master_folios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`folios_rooms_mapping\` ADD CONSTRAINT \`FK_448f8695d8056f12dc0ce67a990\` FOREIGN KEY (\`room_id\`) REFERENCES \`master_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`folios_rooms_mapping\` ADD CONSTRAINT \`FK_88cc521a82df3e26032f5fcc190\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`folios_rooms_mapping\` DROP FOREIGN KEY \`FK_88cc521a82df3e26032f5fcc190\``
        );
        await queryRunner.query(
            `ALTER TABLE \`folios_rooms_mapping\` DROP FOREIGN KEY \`FK_448f8695d8056f12dc0ce67a990\``
        );
        await queryRunner.query(
            `ALTER TABLE \`folios_rooms_mapping\` DROP FOREIGN KEY \`FK_b74e465b2d76f72f9de02bf683e\``
        );

        await queryRunner.query(
            `ALTER TABLE \`template_placeholders\` DROP COLUMN \`filter_key\``
        );

        await queryRunner.query(`DROP TABLE \`folios_rooms_mapping\``);
    }
}
