CREATE TABLE `pos_tables` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `sbu_id` INT NOT NULL,
  `outlet_id` INT NOT NULL,
  `floor_id` INT NOT NULL,
  `table_name` VARCHAR(100) NOT NULL,
  `table_short_code` VARCHAR(50) NOT NULL,
  `capacity` INT NOT NULL,
  `status` ENUM('Available', 'Occupied', 'Hold') NOT NULL DEFAULT 'Available',
  `remarks` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT NULL,

  -- Foreign Keys
  CONSTRAINT `fk_tables_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT `fk_tables_outlet`
    FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlets`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT `fk_tables_floor`
    FOREIGN KEY (`floor_id`) REFERENCES `master_floors`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
