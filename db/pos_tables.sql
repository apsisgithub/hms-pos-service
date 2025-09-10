CREATE TABLE `pos_tables` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
  `sbu_id` INT NOT NULL,
  `outlet_id` INT NOT NULL,
  `floor_id` INT NULL,
  `table_name` VARCHAR(150) NOT NULL,
  `table_short_code` VARCHAR(100) NOT NULL,
  `capacity` INT NOT NULL,
  `status` ENUM('Available','Occupied','Hold','Partial') NOT NULL DEFAULT 'Available',
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_pos_tables_floor`
    FOREIGN KEY (`floor_id`) REFERENCES `master_floor` (`id`),
  CONSTRAINT `FK_pos_tables_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu` (`id`),
  CONSTRAINT `FK_pos_tables_outlet`
    FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 