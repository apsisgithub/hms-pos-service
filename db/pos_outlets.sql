CREATE TABLE `pos_outlets` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sbu_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NULL,
  `description` TEXT NULL,

  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  `deleted_by` INT NULL,

  PRIMARY KEY (`id`),

  CONSTRAINT `fk_pos_outlets_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);
