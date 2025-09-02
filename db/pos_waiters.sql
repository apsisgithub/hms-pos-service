CREATE TABLE `pos_waiters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
  `sbu_id` INT NOT NULL,
  `outlet_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `picture` VARCHAR(255) NULL,
  `employee_code` VARCHAR(50) NULL,
  `phone` VARCHAR(20) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_pos_waiters_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu` (`id`),
  CONSTRAINT `FK_pos_waiters_outlet`
    FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
