CREATE TABLE `pos_counters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sbu_id` INT NOT NULL,
  `outlet_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255) NULL,
  `description` TEXT NULL,
  
  -- CoreEntity fields (guessing: created_at, updated_at, deleted_at, etc.)
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,

  PRIMARY KEY (`id`),

  CONSTRAINT `fk_pos_counters_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `fk_pos_counters_outlet`
    FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlet` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);
