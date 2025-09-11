CREATE TABLE `pos_product_addons` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `product_id` INT NOT NULL,
  `addon_id` INT NOT NULL,
  `extra_price` DECIMAL(10,2) NULL COMMENT 'If set, overrides addon base price',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` DATETIME NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_uuid` (`uuid`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_addon_id` (`addon_id`),
  CONSTRAINT `fk_product_addon_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product_addon_addon` FOREIGN KEY (`addon_id`) REFERENCES `addons`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
