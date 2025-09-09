CREATE TABLE `pos_combo_meal_products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `combo_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_combo` (`combo_id`),
  KEY `fk_product` (`product_id`),
  CONSTRAINT `fk_combo` FOREIGN KEY (`combo_id`) REFERENCES `combo_meals`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
