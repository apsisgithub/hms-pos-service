CREATE TABLE `pos_outlets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `sbu_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(255) NULL,
  `email` VARCHAR(155) NULL,
  `phone` VARCHAR(55) NULL,
  `location` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT NULL,

  -- Foreign key
  CONSTRAINT `fk_outlets_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

 