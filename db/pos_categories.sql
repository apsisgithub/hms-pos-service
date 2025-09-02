CREATE TABLE `pos_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE DEFAULT (UUID()),
  `sbu_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `picture` VARCHAR(255) NULL,
  `parent_id` INT NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_pos_categories_parent`
    FOREIGN KEY (`parent_id`) REFERENCES `pos_categories` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
