CREATE TABLE `pos_table_waiter_assignments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `table_id` INT NOT NULL,
  `waiter_id` INT NOT NULL,
  `assigned_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `unassigned_at` TIMESTAMP NULL,
  `status` ENUM('Active', 'Released', 'Transferred') NOT NULL DEFAULT 'Active',
  `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` DATETIME(6) NULL,
  `createdById` INT NULL,
  `updatedById` INT NULL,
  `deletedById` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_table_waiter_assignment_table`
    FOREIGN KEY (`table_id`) REFERENCES `pos_tables` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `FK_table_waiter_assignment_waiter`
    FOREIGN KEY (`waiter_id`) REFERENCES `pos_waiters` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
