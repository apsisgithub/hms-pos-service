CREATE TABLE `pos_categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sbu_id` INT NOT NULL,
  `uuid` CHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `picture` VARCHAR(255) NULL,
  `parentId` INT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` DATETIME NULL,
  `createdById` INT NULL,
  `updatedById` INT NULL,
  `deletedById` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_pos_categories_uuid` (`uuid`), 
  CONSTRAINT `FK_pos_categories_parent` FOREIGN KEY (`parentId`) REFERENCES `pos_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



 