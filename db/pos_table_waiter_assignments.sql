CREATE TABLE `pos_table_waiter_assignments` (
  `id` INT NOT NULL AUTO_INCREMENT,

  `table_id` INT NOT NULL,
  `waiter_id` INT NOT NULL,

  `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unassigned_at` TIMESTAMP NULL,

  `status` ENUM('Active', 'Released', 'Transferred') NOT NULL DEFAULT 'Active',

  -- CoreEntity common fields (assuming id, created_at, updated_at, deleted_at)
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,

  PRIMARY KEY (`id`),

  CONSTRAINT `fk_table_waiter_assignments_table`
    FOREIGN KEY (`table_id`) REFERENCES `pos_tables` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT `fk_table_waiter_assignments_waiter`
    FOREIGN KEY (`waiter_id`) REFERENCES `pos_waiters` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
);
