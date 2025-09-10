CREATE TABLE `order_tokens` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT NOT NULL,
  `token_number` VARCHAR(20) NOT NULL, -- e.g. T001, T002
  `type` ENUM('KOT', 'BILL') NOT NULL DEFAULT 'KOT',
  `print_count` INT NOT NULL DEFAULT 0,
  `printed_at` TIMESTAMP NULL DEFAULT NULL,
  `served_at` TIMESTAMP NULL DEFAULT NULL,
  `status` ENUM('NEW', 'PRINTED', 'SERVED', 'CANCELLED') NOT NULL DEFAULT 'NEW',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT `fk_order_tokens_order` FOREIGN KEY (`order_id`) REFERENCES `pos_orders` (`id`) ON DELETE CASCADE,

  INDEX `idx_order_tokens_order_id` (`order_id`),
  INDEX `idx_order_tokens_type` (`type`),
  INDEX `idx_order_tokens_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
