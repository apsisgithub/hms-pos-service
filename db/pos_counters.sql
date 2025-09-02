CREATE TABLE `pos_counters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
  `sbu_id` INT NOT NULL,
  `outlet_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_pos_counters_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu` (`id`),
  CONSTRAINT `FK_pos_counters_outlet`
    FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
