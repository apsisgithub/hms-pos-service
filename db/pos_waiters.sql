

CREATE TABLE `pos_waiters` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `sbu_id` INT NOT NULL,
  `outlet_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_pos_waiters_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu` (`id`),
  CONSTRAINT `fk_pos_waiters_outlet`
    FOREIGN KEY (`outlet_id`) REFERENCES `outlets` (`id`),
  CONSTRAINT `fk_pos_waiters_user`
    FOREIGN KEY (`user_id`) REFERENCES `master_users` (`id`)
);
