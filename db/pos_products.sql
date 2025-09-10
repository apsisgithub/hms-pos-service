CREATE TABLE `pos_products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` CHAR(36) NOT NULL UNIQUE,
  `sbu_id` INT NOT NULL,
  `outlet_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `subcategory_id` INT NOT NULL,
  `name` VARCHAR(255) NULL,
  `image` VARCHAR(200) NULL,
  `description` TEXT NULL,
  `menu_type` VARCHAR(25) NULL,
  `product_vat` DECIMAL(10,3) NOT NULL DEFAULT 0,
  `special` INT NOT NULL DEFAULT 0,
  `Offer_rate` INT NOT NULL DEFAULT 0 COMMENT '1=offer rate',
  `offer_is_available` INT NOT NULL DEFAULT 0 COMMENT '1=offer available,0=No Offer',
  `offer_start_date` DATE NULL,
  `offer_end_date` DATE NULL,
  `component` TEXT NULL,
  `Position` INT NULL,
  `kitchen_id` INT NOT NULL,
  `is_group` INT NULL,
  `is_varient` INT NOT NULL DEFAULT 0,
  `base_price` DECIMAL(10,2) NOT NULL,
  `discount` DECIMAL(10,2) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `is_custom_qty` INT NOT NULL DEFAULT 0,
  `cooked_time` TIME NOT NULL DEFAULT '00:00:00',
  `is_active` TINYINT(1) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  `created_by` INT NULL,
  `updated_by` INT NULL,
  `deleted_by` INT NULL,

  -- Foreign keys
  CONSTRAINT `fk_products_category`
    FOREIGN KEY (`category_id`) REFERENCES `pos_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_subcategory`
    FOREIGN KEY (`subcategory_id`) REFERENCES `pos_categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_kitchen`
    FOREIGN KEY (`kitchen_id`) REFERENCES `pos_kitchens` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_outlet`
    FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlets` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_products_sbu`
    FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
