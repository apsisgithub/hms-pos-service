CREATE TABLE `pos_orders` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `outlet_id` INT NOT NULL,
  `order_no` VARCHAR(50) NOT NULL UNIQUE,
  `order_type` ENUM('Dine-in','Take Away','Pick-up','Room Service','Advance Booking') NOT NULL DEFAULT 'Dine-in',
  `table_id` BIGINT NULL,
  `waiter_id` INT NULL,
  `guest_count` INT NULL,
  `room_id` INT NULL,
  `customer_id` INT NULL,
  `customer_preference` VARCHAR(255) NULL,
  `internal_note` VARCHAR(255) NULL,
  `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `tax` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `service_charge` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `discount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `grand_total` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `status` ENUM('Pending','In-Progress','Ready','Served','Completed','Cancelled','Hold') NOT NULL DEFAULT 'Pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` INT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` INT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `deleted_by` INT NULL,

  -- Foreign keys
  CONSTRAINT `FK_pos_orders_outlet` FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlets`(`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_pos_orders_table` FOREIGN KEY (`table_id`) REFERENCES `pos_tables`(`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_pos_orders_waiter` FOREIGN KEY (`waiter_id`) REFERENCES `pos_waiters`(`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_pos_orders_room` FOREIGN KEY (`room_id`) REFERENCES `master_rooms`(`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_pos_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `master_guests`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- CREATE TABLE `pos_orders` (
--   `id` INT AUTO_INCREMENT PRIMARY KEY,
--   `uuid` CHAR(36) NOT NULL UNIQUE,
--   `outlet_id` INT NOT NULL,
--   `order_no` VARCHAR(50) NOT NULL UNIQUE,
--   `order_type` ENUM('Dine-in', 'Take Away', 'Pick-up', 'Room Service', 'Advance Booking') DEFAULT 'Dine-in',
--   `table_id` INT NULL,
--   `waiter_id` INT NULL,
--   `guest_count` INT NULL,
--   `room_id` INT NULL,
--   `customer_id` INT NULL,
--   `customer_preference` VARCHAR(255) NULL,
--   `internal_note` VARCHAR(255) NULL,
--   `subtotal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--   `tax` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--   `service_charge` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--   `discount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--   `grand_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
--   `status` ENUM('Pending','In-Progress','Ready','Served','Completed','Cancelled','Hold') DEFAULT 'Pending',
--   `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   `created_by` INT NULL,
--   `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   `updated_by` INT NULL,
--   `deleted_at` TIMESTAMP NULL,
--   `deleted_by` INT NULL,

--   -- Foreign keys
--   CONSTRAINT `fk_orders_outlet` FOREIGN KEY (`outlet_id`) REFERENCES `outlets`(`id`) ON DELETE CASCADE,
--   CONSTRAINT `fk_orders_table` FOREIGN KEY (`table_id`) REFERENCES `pos_tables`(`id`) ON DELETE CASCADE,
--   CONSTRAINT `fk_orders_waiter` FOREIGN KEY (`waiter_id`) REFERENCES `pos_waiters`(`id`) ON DELETE SET NULL,
--   CONSTRAINT `fk_orders_room` FOREIGN KEY (`room_id`) REFERENCES `master_rooms`(`id`) ON DELETE SET NULL,
--   CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customer_id`) REFERENCES `master_guests`(`id`) ON DELETE SET NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
