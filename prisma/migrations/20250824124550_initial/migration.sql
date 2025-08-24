-- CreateTable
CREATE TABLE `master_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `mobile_no` VARCHAR(50) NULL,
    `contact_no` VARCHAR(50) NULL,
    `alternative_contact_no` VARCHAR(50) NULL,
    `address` TEXT NULL,
    `nationality` VARCHAR(100) NULL,
    `user_role_id` INTEGER NULL,
    `designation` VARCHAR(100) NULL,
    `department` VARCHAR(100) NULL,
    `identification_number` VARCHAR(255) NULL,
    `identification_type` VARCHAR(255) NULL,
    `bank_name` VARCHAR(255) NULL,
    `branch_name` VARCHAR(255) NULL,
    `salary_account_no` VARCHAR(50) NULL,
    `mfs_no` VARCHAR(50) NULL,
    `calendar_language` ENUM('English/UK') NOT NULL DEFAULT 'English/UK',
    `language` ENUM('Default') NOT NULL DEFAULT 'Default',
    `show_last_credit_card_digits` INTEGER NULL DEFAULT 4,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `cv_attachment_url` TEXT NULL,
    `profile_picture_url` TEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    UNIQUE INDEX `IDX_6c2805cf6d98d187b26192a635`(`user_name`),
    UNIQUE INDEX `IDX_8c6cb7b65491d9e7557cc0547e`(`name`),
    UNIQUE INDEX `IDX_e54f163f206939ba0a65fd6920`(`email`),
    INDEX `FK_ff4054659884d19bfad1e8264e3`(`user_role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `reservation_id` INTEGER NOT NULL,
    `sbu_id` INTEGER NOT NULL,
    `prev_title` VARCHAR(255) NULL,
    `prev_description` TEXT NULL,
    `after_title` VARCHAR(255) NOT NULL,
    `after_description` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `operation_type` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_template_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `sbu_id` INTEGER NOT NULL,

    UNIQUE INDEX `IDX_b6bb1f1d004e6d3f3cb38e40ee`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `folios_rooms_mapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `folio_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `reservation_id` INTEGER NOT NULL,

    INDEX `FK_448f8695d8056f12dc0ce67a990`(`room_id`),
    INDEX `FK_88cc521a82df3e26032f5fcc190`(`reservation_id`),
    INDEX `FK_b74e465b2d76f72f9de02bf683e`(`folio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `housekeeping_work_order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `room_id` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM('clean', 'maintenance', 'repair', 'other') NOT NULL,
    `priority` ENUM('high', 'medium', 'low') NOT NULL,
    `status` ENUM('new', 'assigned', 'in_progress', 'completed') NOT NULL DEFAULT 'new',
    `assign_to` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `remark` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `housekeeping_work_order_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `work_order_id` INTEGER NOT NULL,
    `status` ENUM('new', 'assigned', 'in_progress', 'completed') NOT NULL,
    `assign_to` INTEGER NULL,
    `remark` TEXT NULL,

    INDEX `FK_ed9772b6754995ee67b9f3adf3d`(`work_order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_buildings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    INDEX `FK_7c037dfae57a2d6acccdd7855fe`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_business_agents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `short_code` VARCHAR(50) NULL,
    `color` VARCHAR(20) NULL,
    `commission` TEXT NULL,
    `bin_number` VARCHAR(50) NULL,
    `address` TEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    INDEX `FK_28c2cf307f1268cd6e06389c3ff`(`sbu_id`),
    UNIQUE INDEX `composite_idx_name_short_code`(`name`, `short_code`, `sbu_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_business_sources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` TEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `short_code` VARCHAR(50) NULL,
    `market_code` VARCHAR(50) NULL,
    `registration_no` VARCHAR(50) NULL,
    `color_code` VARCHAR(10) NULL,

    INDEX `FK_e92ca5cf2d865ed0e8b8a60961e`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_charges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `ref_no` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `type` ENUM('RoomCharges', 'AirportPickup', 'BreakfastWithLunchOrDinner', 'Damage', 'BalanceTransfer') NOT NULL,
    `posting_type` ENUM('CheckInAndCheckOut', 'EveryDay', 'EveryDayExceptCheckIn', 'EveryDayExceptCheckInAndCheckOut', 'EveryDayExceptCheckOut', 'CustomDate', 'CheckOut') NULL,
    `charge_rule` ENUM('PerAdult', 'PerBooking', 'PerChild', 'PerPerson', 'PerQuanity') NULL,
    `is_tax_included` TINYINT NOT NULL DEFAULT 0,
    `sub_type` ENUM('Late Checkout Charges', 'Cancellation Revenue', 'Day Use Charges', 'No Show Revenue', 'Room Charges') NULL,
    `folio_id` INTEGER NULL,
    `charge_date` DATE NOT NULL,

    INDEX `FK_6711291e50c902f43b73e24ba12`(`folio_id`),
    INDEX `FK_8adbe07a8833b02d645d52d0886`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_companies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `register_name` VARCHAR(255) NOT NULL,
    `company_known_as` VARCHAR(255) NULL,
    `company_address` TEXT NULL,
    `company_phone_number` VARCHAR(50) NULL,
    `fax` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `website` VARCHAR(255) NULL,
    `company_code` VARCHAR(100) NULL,
    `contact_person` TEXT NULL,
    `credit_validity` INTEGER NULL,
    `current_outstanding` DECIMAL(10, 2) NULL,
    `over_limit_action` VARCHAR(100) NULL,
    `last_payment_date` DATE NULL,
    `is_ledger_applied` TINYINT NULL,
    `credit_limit` DECIMAL(10, 2) NULL,
    `payment_term` VARCHAR(100) NULL,
    `authorization_required` TINYINT NULL,
    `approver_name` VARCHAR(255) NULL,
    `is_offer_applied` TINYINT NULL,
    `services` TEXT NULL,
    `discount_percentage` DECIMAL(5, 2) NULL,
    `sbu_id` INTEGER NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    UNIQUE INDEX `IDX_fe7f4d8030943d2b4ef9ca0d99`(`company_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_credit_cards` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `reservation_id` INTEGER NULL,
    `card_number` VARCHAR(20) NOT NULL,
    `card_holder_name` VARCHAR(100) NOT NULL,
    `expiry_month` INTEGER NOT NULL,
    `expiry_year` INTEGER NOT NULL,
    `cvv` INTEGER NOT NULL,
    `card_type` ENUM('physical_card', 'virtual_card') NOT NULL,
    `sbu_id` INTEGER NOT NULL,

    INDEX `FK_740e3064a55a6136d46a9b8c011`(`reservation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_currencies` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `currency_code` VARCHAR(10) NOT NULL,
    `sign` VARCHAR(10) NULL,
    `is_sign_prefix` TINYINT NOT NULL DEFAULT 1,
    `digits_after_decimal` INTEGER NOT NULL DEFAULT 2,
    `base_exchange_rate` DECIMAL(10, 4) NOT NULL,
    `dollar_exchange_rate` DECIMAL(10, 4) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `currency` VARCHAR(10) NOT NULL,

    INDEX `FK_2989251932dd4afe0be26ad9cdc`(`sbu_id`),
    UNIQUE INDEX `composite_idx_currencyCode`(`currency_code`, `sbu_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_currency_exchange_rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `currency_code` VARCHAR(255) NOT NULL,
    `digits_after_decimal` VARCHAR(255) NOT NULL,
    `base_exchange_rate` FLOAT NOT NULL,
    `dollar_exchange_rate` FLOAT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `menu_access` LONGTEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_2faf63fe445cfc8f0240e34ee73`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_discounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(50) NULL,
    `type` ENUM('percentage', 'fixed') NULL,
    `value` DECIMAL(10, 2) NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `applies_to` LONGTEXT NULL,
    `is_active` TINYINT NOT NULL DEFAULT 1,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_1407a93544d9f627e3533386a30`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_display_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `theme_color_primary` VARCHAR(7) NULL,
    `theme_color_secondary` VARCHAR(7) NULL,
    `font_family` VARCHAR(100) NULL,
    `currency_display_format` VARCHAR(50) NULL,
    `language_code` VARCHAR(10) NOT NULL DEFAULT 'en',
    `show_invoice_terms` TINYINT NOT NULL DEFAULT 1,
    `weekend_days` LONGTEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `arr_dept_date_format` ENUM('DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY') NOT NULL DEFAULT 'DD-MM-YYYY',
    `round_off_type` ENUM('-1', '<>0', '1') NOT NULL DEFAULT '<>0',
    `round_off_limit` INTEGER NULL,
    `add_up_round_off_to_rates` TINYINT NOT NULL DEFAULT 0,
    `salutation` ENUM('Mr.', 'Ms.', 'Mrs.', 'Dr.') NOT NULL DEFAULT 'Mr.',
    `identity_type` ENUM('NID', 'Passport', 'Driving License', 'Birth Certificate', 'Other') NOT NULL DEFAULT 'NID',
    `default_reservation_type` ENUM('Confirm Booking', 'Tentative') NOT NULL DEFAULT 'Confirm Booking',
    `bill_to` ENUM('Guest', 'Company', 'Agent') NULL,
    `state_caption` VARCHAR(100) NULL,
    `zip_code_caption` VARCHAR(100) NULL,
    `is_tax_inclusive_rates` TINYINT NOT NULL DEFAULT 0,
    `web_rate_mode` ENUM('Regular', 'Allocated') NOT NULL DEFAULT 'Regular',
    `web_room_inventory_mode` ENUM('Regular', 'Allocated') NOT NULL DEFAULT 'Regular',
    `group_payment_posting_mode` ENUM('Group Owner', 'Room Distribution') NOT NULL DEFAULT 'Group Owner',
    `registration_no_mandatory_for_travel_agent` TINYINT NOT NULL DEFAULT 0,
    `payment_mode` ENUM('Cash/Bank', 'City Ledger') NULL,
    `payment_gateway` ENUM('Common PG', 'shift4') NULL,
    `timezone` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `nationality` VARCHAR(100) NULL,
    `date_format` ENUM('DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY') NOT NULL DEFAULT 'DD-MM-YYYY',
    `time_format` ENUM('HH:mm', 'hh:mm A') NOT NULL DEFAULT 'HH:mm',
    `generate_invoice_on_checkout` TINYINT NULL DEFAULT 0,
    `generate_invoice_on_cancel` TINYINT NULL DEFAULT 0,
    `generate_invoice_on_no_show` TINYINT NULL DEFAULT 0,
    `generate_single_invoice_for_groups` TINYINT NULL DEFAULT 0,
    `no_charge_void_charge_folio` TINYINT NULL DEFAULT 0,

    UNIQUE INDEX `IDX_be4f6c38295ce80f6abe34e7d4`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_email_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `subject` VARCHAR(512) NULL,
    `body` TEXT NULL,
    `cc` VARCHAR(512) NULL,
    `bcc` VARCHAR(512) NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `template_used_for` ENUM('booking', 'invoice', 'marketing', 'other') NULL,
    `category_id` INTEGER NULL,

    INDEX `FK_0e43717f7833c6c6499a0b4ce09`(`category_id`),
    INDEX `FK_7f925743a6e701656026f20ed9f`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_extra_charges` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `short_code` VARCHAR(50) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `rate` ENUM('Flat Percentage', 'Flat Amount') NOT NULL,
    `front_desk_sort_key` INTEGER NULL,
    `is_fixed_price` TINYINT NOT NULL DEFAULT 0,
    `rate_value` FLOAT NULL,
    `apply_on_offered_room_rent` ENUM('Net Rate', 'Sell Rate') NOT NULL,
    `taxes` TEXT NULL,
    `rate_inclusive_tax` INTEGER NULL,
    `publish_on_web` TINYINT NOT NULL DEFAULT 0,
    `always_charge` TINYINT NOT NULL DEFAULT 0,
    `voucher_no_type` ENUM('Auto - Private', 'Auto - General', 'Manual') NOT NULL,
    `voucher_prefix` VARCHAR(50) NULL,
    `voucher_start_from` INTEGER NULL,
    `web_applies_on` VARCHAR(255) NULL,
    `web_posting_rule` ENUM('CheckIn and CheckOut', 'Everyday', 'Everyday except CheckIn', 'Only CheckIn', 'Only CheckOut') NULL,
    `web_description` TEXT NULL,
    `web_res_sort_key` INTEGER NULL,
    `web_valid_from` DATE NULL,
    `web_valid_to` DATE NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_floors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `building_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `number` INTEGER NOT NULL,
    `sort_order` INTEGER NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_953e441251b3bc130db0f18a75c`(`building_id`),
    INDEX `FK_e48ee6c9f6f17ae427ba717226f`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_folio_discounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `discount_id` INTEGER NOT NULL,
    `discount_amount` DECIMAL(10, 2) NOT NULL,
    `folio_id` INTEGER NOT NULL,
    `description` TEXT NULL,

    INDEX `FK_290d81a1ab3dd22f2045c49a2bf`(`folio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_folios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `folio_no` VARCHAR(50) NOT NULL,
    `guest_id` INTEGER NOT NULL,
    `sbu_id` INTEGER NOT NULL,
    `folio_type` ENUM('Guest', 'Company', 'Group Owner') NOT NULL DEFAULT 'Guest',
    `reservation_id` INTEGER NOT NULL,
    `status` ENUM('Open', 'Closed', 'Cut') NOT NULL DEFAULT 'Open',

    UNIQUE INDEX `IDX_e5da0f48cd45d070a17aca26ac`(`folio_no`),
    INDEX `FK_546b1077b2af5ddab1a2f0b0e22`(`guest_id`),
    INDEX `FK_6ae11829fc0d74668897cc4f608`(`sbu_id`),
    INDEX `FK_b9f76c8bab66a9021465af82191`(`reservation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_guests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `guest_image_url` VARCHAR(255) NULL,
    `salutation` VARCHAR(50) NULL,
    `name` VARCHAR(255) NOT NULL,
    `contact_no` VARCHAR(50) NULL,
    `email` VARCHAR(255) NULL,
    `id_type` ENUM('nid', 'passport', 'driving_license', 'birth_certificate', 'other') NULL,
    `id_image_url` VARCHAR(255) NULL,
    `id_number` VARCHAR(100) NULL,
    `date_of_birth` DATE NULL,
    `address` TEXT NULL,
    `country` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `postal_code` VARCHAR(20) NULL,
    `personal_preferences` TEXT NULL,
    `is_member` TINYINT NOT NULL DEFAULT 0,
    `total_points_earned` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `redeemed_points` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `remaining_points` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `sbu_id` INTEGER NULL,
    `company_name` VARCHAR(255) NULL,
    `title` VARCHAR(20) NULL,
    `phone` VARCHAR(50) NULL,
    `occupation` VARCHAR(255) NULL,
    `vip_status` ENUM('Bronze', 'Gold', 'Platinum', 'Silver', 'Diamond') NULL,
    `nationality` VARCHAR(100) NULL,
    `id_expiry_date` DATE NULL,
    `id_issuing_country` VARCHAR(100) NULL,
    `id_issuing_city` VARCHAR(100) NULL,
    `guest_type` ENUM('Adult', 'Child', 'Infant', 'Other') NULL,
    `birth_country` VARCHAR(100) NULL,
    `birth_city` VARCHAR(100) NULL,
    `purpose_of_visit` ENUM('Business & MICE', 'Event (Music', ' Festival', ' etc.)', 'Government/Diplomatic', 'Leisure or Special Occasion', 'Other (Medical', ' Transit') NULL,
    `state` VARCHAR(100) NULL,
    `designation` VARCHAR(255) NULL,
    `work_address` TEXT NULL,
    `work_country` VARCHAR(100) NULL,
    `work_state` VARCHAR(100) NULL,
    `work_city` VARCHAR(100) NULL,
    `work_postal_code` VARCHAR(20) NULL,
    `work_phone1` VARCHAR(50) NULL,
    `work_phone2` VARCHAR(50) NULL,
    `work_fax` VARCHAR(50) NULL,
    `work_email` VARCHAR(255) NULL,
    `work_website` VARCHAR(255) NULL,
    `vehicle_registration_no` VARCHAR(100) NULL,
    `license_number` VARCHAR(100) NULL,
    `license_country` VARCHAR(100) NULL,
    `license_state` VARCHAR(100) NULL,
    `spouse_name` VARCHAR(255) NULL,
    `spouse_dob` DATE NULL,
    `marriage_anniversary` DATE NULL,
    `marital_status` ENUM('Single', 'Married', 'Divorced', 'Widowed', 'Other') NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL DEFAULT 'Male',

    INDEX `FK_418303172a3713a61994b335109`(`sbu_id`),
    FULLTEXT INDEX `IDX_GUEST_ALL_FULLTEXT`(`name`, `email`, `contact_no`),
    FULLTEXT INDEX `IDX_GUEST_CONTACT_FULLTEXT`(`contact_no`),
    FULLTEXT INDEX `IDX_GUEST_EMAIL_FULLTEXT`(`email`),
    FULLTEXT INDEX `IDX_GUEST_NAME_FULLTEXT`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_hotel_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `check_in_time` TIME(0) NOT NULL DEFAULT ('14:00:00'),
    `check_out_time` TIME(0) NOT NULL DEFAULT ('12:00:00'),
    `cancellation_policy` TEXT NULL,
    `smoking_allowed` TINYINT NOT NULL DEFAULT 0,
    `pet_policy` TEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    UNIQUE INDEX `IDX_3d7b08e573b0480397db9dd660`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_joint_room_mapping_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `joint_room_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,

    INDEX `FK_58fd7ea3c29580284dc2e0f1458`(`room_id`),
    UNIQUE INDEX `IDX_9308426ffc9c1814e79553dc1f`(`joint_room_id`, `room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_joint_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `joint_room_name` VARCHAR(255) NOT NULL,
    `number_of_rooms` INTEGER NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    UNIQUE INDEX `IDX_3542b69981c8133790921954c3`(`joint_room_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_market_code` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `market_code_name` VARCHAR(255) NOT NULL,
    `sbu_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_measurement_units` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `abbreviation` VARCHAR(10) NULL,
    `is_active` TINYINT NOT NULL DEFAULT 1,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_1258dc1269cb5a0e34e2c08f572`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_payment_modes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `type` ENUM('cash', 'card', 'online', 'other') NOT NULL,
    `details` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `ref_no` INTEGER NULL,
    `transaction_id` VARCHAR(36) NOT NULL,
    `sbu_id` INTEGER NOT NULL,
    `currency_id` INTEGER NULL,
    `credit_card_id` INTEGER NULL,
    `payment_mode_id` INTEGER NOT NULL,
    `paid_amount` DECIMAL(12, 2) NOT NULL,
    `paid_date` DATE NULL,
    `payment_status` ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'chargeback', 'expired', 'cancelled') NOT NULL DEFAULT 'paid',
    `description` VARCHAR(255) NOT NULL,
    `folio_id` INTEGER NULL,

    UNIQUE INDEX `IDX_a4a33e25e466ca3e6ebf75c150`(`transaction_id`),
    INDEX `FK_0aa01e20eca82efdd41c814f5ba`(`payment_mode_id`),
    INDEX `FK_4d0640f48c4fcd612132743f6bc`(`currency_id`),
    INDEX `FK_54422931dae1b1690b97c6eca81`(`sbu_id`),
    INDEX `FK_84aff9385ee0d6305caaae03e09`(`credit_card_id`),
    INDEX `FK_ced9c5b197dbef3a56bf9ea5ecc`(`folio_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_permission_actions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `name` VARCHAR(100) NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    UNIQUE INDEX `IDX_ba147bc1a634319309de282260`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_permission_modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `parent_id` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `menu_url` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_pos_points` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `currency_id` INTEGER NULL,
    `vat_enabled` TINYINT NOT NULL DEFAULT 1,
    `service_charge_enabled` TINYINT NOT NULL DEFAULT 1,
    `logo_url` VARCHAR(512) NULL,
    `email` VARCHAR(255) NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_663f0f65ccad22c1e907f073b2f`(`currency_id`),
    INDEX `FK_fd27b50b4d6d2bac8fb9f2516bd`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_rate_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NULL,
    `short_code` VARCHAR(50) NULL,
    `is_tax_included` TINYINT NOT NULL DEFAULT 0,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    INDEX `FK_9d655047c8946b5651ff50c669c`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `sbu_id` INTEGER NOT NULL,

    UNIQUE INDEX `IDX_6b3cfa78263cbbf2a340af392c`(`name`),
    INDEX `FK_464a19593fe9342214326ca7e44`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_reservation_billing_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `reservation_id` INTEGER NOT NULL,
    `billing_type` ENUM('Cash/Bank', 'City Ledger') NOT NULL DEFAULT 'Cash/Bank',
    `payment_mode_id` INTEGER NOT NULL,
    `registration_no` VARCHAR(100) NULL,
    `reservation_type` ENUM('Confirm Booking', 'Hold Confirm Booking', 'Hold Unconfirm Booking', 'Online Failed Booking', 'Released', 'Unconfirmed Booking Inquiry') NOT NULL DEFAULT 'Hold Confirm Booking',
    `rate_plan_package_id` INTEGER NULL,
    `guest_id` INTEGER NULL,
    `rate_plan_package_details` TEXT NULL,
    `send_checkout_email` TINYINT NOT NULL DEFAULT 0,
    `checkout_email_template_id` INTEGER NULL,
    `suppress_rate_on_gr_card` TINYINT NOT NULL DEFAULT 0,
    `display_inclusion_separately_on_folio` TINYINT NOT NULL DEFAULT 0,
    `apply_to_group` TINYINT NOT NULL DEFAULT 0,
    `market_code_id` INTEGER NULL,
    `business_source_id` INTEGER NULL,
    `travel_agent_id` INTEGER NULL,
    `voucher_no` VARCHAR(20) NULL,
    `commission_plan` ENUM('Confirm Booking', 'Non Refundable', 'Corporate') NULL DEFAULT 'Confirm Booking',
    `plan_value` DECIMAL(10, 2) NULL,
    `company_id` INTEGER NULL,
    `sales_person_id` INTEGER NULL,

    INDEX `FK_b2458caca02e023421658504452`(`reservation_id`),
    INDEX `FK_b5df971fccc8b065505074b5e89`(`guest_id`),
    INDEX `FK_d8fdc883b4da049dbbd80bacde7`(`checkout_email_template_id`),
    INDEX `FK_f6d25f8cb9c98e5d88886e5b80a`(`payment_mode_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_reservation_guests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `reservation_id` INTEGER NOT NULL,
    `guest_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `is_master_guest` TINYINT NOT NULL DEFAULT 1,

    INDEX `FK_4afa44441fabd5ad27ad4666076`(`reservation_id`),
    INDEX `FK_ff51e3bae0e77197f68b1c41fad`(`guest_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_reservations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `reservation_number` VARCHAR(100) NOT NULL,
    `sbu_id` INTEGER NOT NULL,
    `business_agent_id` INTEGER NULL,
    `total_adults` INTEGER NOT NULL DEFAULT 0,
    `total_children` INTEGER NOT NULL DEFAULT 0,
    `payment_currency_choice` VARCHAR(50) NULL,
    `total_calculated_rate` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `exchange_rate_show` DECIMAL(10, 4) NULL,
    `extra_bed_required` TINYINT NOT NULL DEFAULT 0,
    `split_reservation_flag` TINYINT NOT NULL DEFAULT 0,
    `pickup_drop_required` TINYINT NOT NULL DEFAULT 0,
    `pickup_drop_time` DATETIME(0) NULL,
    `send_email_at_checkout` TINYINT NOT NULL DEFAULT 0,
    `email_booking_vouchers` TEXT NULL,
    `display_inclusion_separately_on_folio` TINYINT NOT NULL DEFAULT 0,
    `advance_paid_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `check_in_datetime` DATETIME(0) NOT NULL,
    `check_out_datetime` DATETIME(0) NOT NULL,
    `reservation_date` DATETIME(0) NULL,
    `booking_source` VARCHAR(50) NULL,
    `channel_name` VARCHAR(100) NULL,
    `reservation_source_reference` VARCHAR(100) NULL,
    `booking_purpose` VARCHAR(100) NULL,
    `special_requests` TEXT NULL,
    `cancelled_by` VARCHAR(100) NULL,
    `cancelled_at` DATETIME(0) NULL,
    `cancellation_reason` TEXT NULL,
    `business_source_id` INTEGER NULL,
    `payment_mode_id` INTEGER NULL,
    `status` ENUM('Confirmed', 'Tentative', 'Cancelled', 'CheckedIn', 'CheckedOut', 'Pending') NOT NULL DEFAULT 'Confirmed',
    `payment_status` ENUM('Paid', 'Pending', 'Refunded', 'Partially Paid') NOT NULL DEFAULT 'Pending',
    `is_rate_includes_taxes` TINYINT NOT NULL DEFAULT 0,
    `is_day_use` TINYINT NOT NULL DEFAULT 0,
    `rate_type` ENUM('Rate Per Night', 'Total Rate for Stay') NOT NULL DEFAULT 'Rate Per Night',

    UNIQUE INDEX `IDX_47f76ea74110ff65798d3be3d5`(`reservation_number`),
    INDEX `FK_1f08e28abee845219ef984df847`(`business_source_id`),
    INDEX `FK_2c6b39121f25718b96d872563bb`(`payment_mode_id`),
    INDEX `FK_77dcfdecd51e3b63a6d2f13acaf`(`sbu_id`),
    INDEX `FK_f0e753647de1734dd419522f2ba`(`business_agent_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_role_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `role_id` INTEGER NOT NULL,
    `permission_module_id` INTEGER NULL,
    `permission_actions_id` LONGTEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    INDEX `FK_30840793dcbefdce640dbf3bbdd`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `sbu_id` INTEGER NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    UNIQUE INDEX `composition_idx_name`(`sbu_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_room_rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `room_type_id` INTEGER NOT NULL,
    `rate_type_id` INTEGER NOT NULL,
    `season_id` INTEGER NULL,
    `price` DECIMAL(10, 2) NULL,
    `installment_count` INTEGER NULL,
    `extra_adult_price` DECIMAL(10, 2) NULL,
    `extra_child_price` DECIMAL(10, 2) NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_2434e20cbda8f872df114a4f483`(`season_id`),
    INDEX `FK_8d8986053c1f0448229e833865b`(`rate_type_id`),
    INDEX `FK_b7b4d9776b022c7e786cd863ad2`(`room_type_id`),
    INDEX `FK_cdcabd8a02bb6ce9714eb8c9fe0`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_room_type_rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rate_type_id` INTEGER NOT NULL,
    `room_type_id` INTEGER NOT NULL,
    `rack_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `extra_child_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `extra_adult_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_1bb8a02543881dcbefb531b8543`(`room_type_id`),
    INDEX `FK_ff7e986908b18d4ee3d61469f7e`(`rate_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_room_types` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `sbu_id` INTEGER NOT NULL DEFAULT 0,
    `short_name` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `base_occupancy_adult` INTEGER NOT NULL DEFAULT 0,
    `base_occupancy_child` INTEGER NOT NULL DEFAULT 0,
    `max_occupancy_adult` INTEGER NOT NULL DEFAULT 0,
    `max_occupancy_child` INTEGER NOT NULL DEFAULT 0,
    `base_price` DECIMAL(10, 2) NOT NULL,
    `higher_price` DECIMAL(10, 2) NULL,
    `base_price_usd` DECIMAL(10, 2) NOT NULL,
    `higher_price_usd` DECIMAL(10, 2) NULL,
    `extra_bed_allowed` TINYINT NOT NULL DEFAULT 0,
    `extra_bed_price` DECIMAL(10, 2) NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    UNIQUE INDEX `IDX_772530e1cf7f974f997dacb44d`(`name`),
    INDEX `FK_10a56f5c1e9540ee4f0cfe8a966`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `room_number` VARCHAR(50) NOT NULL,
    `room_code` VARCHAR(50) NULL,
    `room_type_id` INTEGER NULL,
    `floor_id` INTEGER NULL,
    `building_id` INTEGER NULL,
    `description` TEXT NULL,
    `status` ENUM('available', 'occupied', 'maintenance', 'out_of_service', 'dirty') NOT NULL DEFAULT 'available',
    `general_status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `room_rate` DECIMAL(10, 2) NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_1929723dece76261b97d6585f5e`(`room_type_id`),
    INDEX `FK_2ee47cdeb2fec41717b2ee60a8e`(`floor_id`),
    INDEX `FK_762d41a2347c94d1f3a5988418c`(`sbu_id`),
    INDEX `FK_a0eab794aa371c1f88a2033ff01`(`building_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_sbu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NULL,
    `website` VARCHAR(255) NULL,
    `grade` VARCHAR(50) NULL,
    `bin_number` VARCHAR(50) NULL,
    `currency_code` VARCHAR(10) NOT NULL DEFAULT 'USD',
    `timezone` VARCHAR(100) NOT NULL DEFAULT 'Asia/Dhaka',
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `address1` TEXT NULL,
    `hotline` VARCHAR(50) NULL,
    `fax` VARCHAR(50) NULL,
    `hotel_policy` TEXT NULL,
    `logo_name` VARCHAR(512) NULL,
    `logo_dimension` VARCHAR(50) NULL,
    `vat_software` VARCHAR(255) NULL,
    `tax_rule` VARCHAR(255) NULL,
    `rooms_count` INTEGER NOT NULL DEFAULT 0,
    `assign_ip` VARCHAR(50) NULL,
    `pos_outlets` TEXT NULL,
    `country` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,

    UNIQUE INDEX `composite_idx_name`(`name`, `email`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_season_room_type_mapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `season_id` INTEGER NOT NULL,
    `room_type_id` INTEGER NOT NULL,

    INDEX `FK_20a78a07c24adf6250e7ccb59ca`(`season_id`),
    INDEX `FK_e3b23d1f1c5a10a90352aee381e`(`room_type_id`),
    PRIMARY KEY (`id`, `season_id`, `room_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_seasons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `short_code` VARCHAR(50) NOT NULL,
    `season_name` VARCHAR(255) NOT NULL,
    `from_day` INTEGER NOT NULL,
    `to_day` INTEGER NOT NULL,
    `from_month` INTEGER NOT NULL,
    `to_month` INTEGER NOT NULL,
    `expiration_date` DATE NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    UNIQUE INDEX `composition_idx_short_code`(`sbu_id`, `short_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_taxes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `sbu_id` INTEGER NOT NULL,
    `short_name` VARCHAR(20) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `applies_from` DATE NOT NULL,
    `exempt_after_days` INTEGER NULL,
    `apply_tax` ENUM('During checkout', 'Other') NOT NULL,
    `apply_on_rack_rate` TINYINT NOT NULL DEFAULT 0,
    `note` TEXT NULL,
    `apply_after_amount` DECIMAL(10, 2) NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `tax_rate` DECIMAL(10, 2) NOT NULL,
    `tax_type` ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',

    UNIQUE INDEX `IDX_70bfd9915a0341a04f6727ff0e`(`short_name`),
    INDEX `FK_15422e859d8a1888d3771a252ac`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_transportation_modes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `color_code` VARCHAR(10) NULL,
    `description` TEXT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_f01f07604f287c05d924509f5eb`(`sbu_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_user_accessible_hotels` (
    `user_id` INTEGER NOT NULL,
    `sbu_id` INTEGER NOT NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_f4844bdbbdcebed689cb7b94da1`(`sbu_id`),
    PRIMARY KEY (`user_id`, `sbu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_user_accessible_sbu` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `sbu_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `master_user_activity_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sbu_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `activity_type` VARCHAR(100) NULL,
    `module` VARCHAR(100) NULL,
    `description` TEXT NULL,
    `ip_address` VARCHAR(45) NULL,
    `timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,

    INDEX `FK_4c18350bc046982248b5bbefd96`(`sbu_id`),
    INDEX `FK_d14daf838a1921c81a540fdd765`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `migrations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timestamp` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pos_menus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `outlet_id` INTEGER NOT NULL,
    `unit_id` INTEGER NOT NULL,
    `item_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pos_outlets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NULL,
    `description` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pos_tables` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `outlet_id` INTEGER NOT NULL,
    `table_name` VARCHAR(100) NOT NULL,
    `table_short_code` VARCHAR(50) NOT NULL,
    `capacity` INTEGER NOT NULL,
    `status` ENUM('Available', 'Occupied', 'Hold') NOT NULL DEFAULT 'Available',
    `remarks` TEXT NULL,

    INDEX `FK_b8d66587e026869edfdcb60f546`(`outlet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `reservation_id` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,
    `room_type_id` INTEGER NOT NULL,
    `rate_type_id` INTEGER NOT NULL,
    `adults_in_room` INTEGER NOT NULL DEFAULT 0,
    `children_in_room` INTEGER NOT NULL DEFAULT 0,
    `room_rate` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `discount_applied` DECIMAL(10, 2) NULL,
    `is_assigned` TINYINT NOT NULL DEFAULT 0,
    `folio_id` INTEGER NULL,

    INDEX `FK_54d066b7788c94b9487aec4c0c8`(`reservation_id`),
    INDEX `FK_67b7c9ab5b2f2192916312dd1a5`(`room_type_id`),
    INDEX `FK_cdbbce175bcb1a04fc4e972c5ba`(`room_id`),
    INDEX `FK_f5ec3b8316cc82c7018e8d8f5f0`(`rate_type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservation_source_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `reservation_id` INTEGER NULL,
    `market_code_id` INTEGER NULL,
    `business_source_id` INTEGER NULL,
    `travel_agent_id` INTEGER NULL,
    `voucher_no` VARCHAR(255) NULL,
    `commission_plan` VARCHAR(255) NULL,
    `plan_value` DECIMAL(10, 2) NULL,
    `company_id` INTEGER NULL,
    `sales_person_id` INTEGER NULL,
    `status` ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',

    INDEX `FK_63f5c3b8480be2d4fa12d1efa84`(`company_id`),
    UNIQUE INDEX `composite_idx_reservation_id_status`(`reservation_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `template_placeholder_mappings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `template_id` INTEGER NOT NULL,
    `placeholder_id` INTEGER NOT NULL,

    INDEX `FK_0a8a400646caeb5f21db88cc797`(`template_id`),
    INDEX `FK_fabb560c83e91a3aabcd520c1a1`(`placeholder_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `template_placeholders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NULL,
    `source_module` VARCHAR(50) NOT NULL,
    `source_table` VARCHAR(255) NOT NULL,
    `source_column` VARCHAR(255) NOT NULL,
    `filter_key` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `IDX_2534d80327953769e928b51a55`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `token_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `user_type` INTEGER NOT NULL,
    `refreshtoken` VARCHAR(255) NOT NULL,
    `refreshtokenexpires` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `ip_address` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_by` INTEGER NULL,
    `updated_at` TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_by` INTEGER NULL,
    `deleted_at` TIMESTAMP(6) NULL,
    `deleted_by` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `permission_module_id` INTEGER NOT NULL,
    `permission_actions_id` LONGTEXT NULL,

    INDEX `FK_3495bd31f1862d02931e8e8d2e8`(`user_id`),
    INDEX `FK_a825263026c77e9bd1d5a9a2760`(`permission_module_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `master_users` ADD CONSTRAINT `FK_ff4054659884d19bfad1e8264e3` FOREIGN KEY (`user_role_id`) REFERENCES `master_roles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `folios_rooms_mapping` ADD CONSTRAINT `FK_448f8695d8056f12dc0ce67a990` FOREIGN KEY (`room_id`) REFERENCES `master_rooms`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `folios_rooms_mapping` ADD CONSTRAINT `FK_88cc521a82df3e26032f5fcc190` FOREIGN KEY (`reservation_id`) REFERENCES `master_reservations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `folios_rooms_mapping` ADD CONSTRAINT `FK_b74e465b2d76f72f9de02bf683e` FOREIGN KEY (`folio_id`) REFERENCES `master_folios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `housekeeping_work_order_log` ADD CONSTRAINT `FK_ed9772b6754995ee67b9f3adf3d` FOREIGN KEY (`work_order_id`) REFERENCES `housekeeping_work_order`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_buildings` ADD CONSTRAINT `FK_7c037dfae57a2d6acccdd7855fe` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_business_agents` ADD CONSTRAINT `FK_28c2cf307f1268cd6e06389c3ff` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_business_sources` ADD CONSTRAINT `FK_e92ca5cf2d865ed0e8b8a60961e` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_charges` ADD CONSTRAINT `FK_6711291e50c902f43b73e24ba12` FOREIGN KEY (`folio_id`) REFERENCES `master_folios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_charges` ADD CONSTRAINT `FK_8adbe07a8833b02d645d52d0886` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_credit_cards` ADD CONSTRAINT `FK_740e3064a55a6136d46a9b8c011` FOREIGN KEY (`reservation_id`) REFERENCES `master_reservations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_currencies` ADD CONSTRAINT `FK_2989251932dd4afe0be26ad9cdc` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_departments` ADD CONSTRAINT `FK_2faf63fe445cfc8f0240e34ee73` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_discounts` ADD CONSTRAINT `FK_1407a93544d9f627e3533386a30` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_display_settings` ADD CONSTRAINT `FK_be4f6c38295ce80f6abe34e7d42` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_email_templates` ADD CONSTRAINT `FK_0e43717f7833c6c6499a0b4ce09` FOREIGN KEY (`category_id`) REFERENCES `email_template_categories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_email_templates` ADD CONSTRAINT `FK_7f925743a6e701656026f20ed9f` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_floors` ADD CONSTRAINT `FK_953e441251b3bc130db0f18a75c` FOREIGN KEY (`building_id`) REFERENCES `master_buildings`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_floors` ADD CONSTRAINT `FK_e48ee6c9f6f17ae427ba717226f` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_folio_discounts` ADD CONSTRAINT `FK_290d81a1ab3dd22f2045c49a2bf` FOREIGN KEY (`folio_id`) REFERENCES `master_folios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_folios` ADD CONSTRAINT `FK_546b1077b2af5ddab1a2f0b0e22` FOREIGN KEY (`guest_id`) REFERENCES `master_guests`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_folios` ADD CONSTRAINT `FK_6ae11829fc0d74668897cc4f608` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_folios` ADD CONSTRAINT `FK_b9f76c8bab66a9021465af82191` FOREIGN KEY (`reservation_id`) REFERENCES `master_reservations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_guests` ADD CONSTRAINT `FK_418303172a3713a61994b335109` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_hotel_settings` ADD CONSTRAINT `FK_3d7b08e573b0480397db9dd6607` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_joint_room_mapping_rooms` ADD CONSTRAINT `FK_58fd7ea3c29580284dc2e0f1458` FOREIGN KEY (`room_id`) REFERENCES `master_rooms`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_joint_room_mapping_rooms` ADD CONSTRAINT `FK_c8a2e1fa3d27f55be10f338032f` FOREIGN KEY (`joint_room_id`) REFERENCES `master_joint_rooms`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_measurement_units` ADD CONSTRAINT `FK_1258dc1269cb5a0e34e2c08f572` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_payments` ADD CONSTRAINT `FK_0aa01e20eca82efdd41c814f5ba` FOREIGN KEY (`payment_mode_id`) REFERENCES `master_payment_modes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_payments` ADD CONSTRAINT `FK_4d0640f48c4fcd612132743f6bc` FOREIGN KEY (`currency_id`) REFERENCES `master_currencies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_payments` ADD CONSTRAINT `FK_54422931dae1b1690b97c6eca81` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_payments` ADD CONSTRAINT `FK_84aff9385ee0d6305caaae03e09` FOREIGN KEY (`credit_card_id`) REFERENCES `master_credit_cards`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_payments` ADD CONSTRAINT `FK_ced9c5b197dbef3a56bf9ea5ecc` FOREIGN KEY (`folio_id`) REFERENCES `master_folios`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_pos_points` ADD CONSTRAINT `FK_663f0f65ccad22c1e907f073b2f` FOREIGN KEY (`currency_id`) REFERENCES `master_currencies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_pos_points` ADD CONSTRAINT `FK_fd27b50b4d6d2bac8fb9f2516bd` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_rate_types` ADD CONSTRAINT `FK_9d655047c8946b5651ff50c669c` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reports` ADD CONSTRAINT `FK_464a19593fe9342214326ca7e44` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservation_billing_details` ADD CONSTRAINT `FK_b2458caca02e023421658504452` FOREIGN KEY (`reservation_id`) REFERENCES `master_reservations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservation_billing_details` ADD CONSTRAINT `FK_b5df971fccc8b065505074b5e89` FOREIGN KEY (`guest_id`) REFERENCES `master_guests`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservation_billing_details` ADD CONSTRAINT `FK_d8fdc883b4da049dbbd80bacde7` FOREIGN KEY (`checkout_email_template_id`) REFERENCES `master_email_templates`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservation_billing_details` ADD CONSTRAINT `FK_f6d25f8cb9c98e5d88886e5b80a` FOREIGN KEY (`payment_mode_id`) REFERENCES `master_payment_modes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservation_guests` ADD CONSTRAINT `FK_4afa44441fabd5ad27ad4666076` FOREIGN KEY (`reservation_id`) REFERENCES `master_reservations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservation_guests` ADD CONSTRAINT `FK_ff51e3bae0e77197f68b1c41fad` FOREIGN KEY (`guest_id`) REFERENCES `master_guests`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservations` ADD CONSTRAINT `FK_1f08e28abee845219ef984df847` FOREIGN KEY (`business_source_id`) REFERENCES `master_business_sources`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservations` ADD CONSTRAINT `FK_2c6b39121f25718b96d872563bb` FOREIGN KEY (`payment_mode_id`) REFERENCES `master_payment_modes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservations` ADD CONSTRAINT `FK_77dcfdecd51e3b63a6d2f13acaf` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_reservations` ADD CONSTRAINT `FK_f0e753647de1734dd419522f2ba` FOREIGN KEY (`business_agent_id`) REFERENCES `master_business_agents`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_role_permissions` ADD CONSTRAINT `FK_30840793dcbefdce640dbf3bbdd` FOREIGN KEY (`role_id`) REFERENCES `master_roles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_roles` ADD CONSTRAINT `FK_85f924bae0ee929b41a6b037bc1` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_room_rates` ADD CONSTRAINT `FK_2434e20cbda8f872df114a4f483` FOREIGN KEY (`season_id`) REFERENCES `master_seasons`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_room_rates` ADD CONSTRAINT `FK_8d8986053c1f0448229e833865b` FOREIGN KEY (`rate_type_id`) REFERENCES `master_rate_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_room_rates` ADD CONSTRAINT `FK_b7b4d9776b022c7e786cd863ad2` FOREIGN KEY (`room_type_id`) REFERENCES `master_room_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_room_rates` ADD CONSTRAINT `FK_cdcabd8a02bb6ce9714eb8c9fe0` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_room_type_rates` ADD CONSTRAINT `FK_1bb8a02543881dcbefb531b8543` FOREIGN KEY (`room_type_id`) REFERENCES `master_room_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_room_type_rates` ADD CONSTRAINT `FK_ff7e986908b18d4ee3d61469f7e` FOREIGN KEY (`rate_type_id`) REFERENCES `master_rate_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_room_types` ADD CONSTRAINT `FK_10a56f5c1e9540ee4f0cfe8a966` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_rooms` ADD CONSTRAINT `FK_1929723dece76261b97d6585f5e` FOREIGN KEY (`room_type_id`) REFERENCES `master_room_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_rooms` ADD CONSTRAINT `FK_2ee47cdeb2fec41717b2ee60a8e` FOREIGN KEY (`floor_id`) REFERENCES `master_floors`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_rooms` ADD CONSTRAINT `FK_762d41a2347c94d1f3a5988418c` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_rooms` ADD CONSTRAINT `FK_a0eab794aa371c1f88a2033ff01` FOREIGN KEY (`building_id`) REFERENCES `master_buildings`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_season_room_type_mapping` ADD CONSTRAINT `FK_20a78a07c24adf6250e7ccb59ca` FOREIGN KEY (`season_id`) REFERENCES `master_seasons`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_season_room_type_mapping` ADD CONSTRAINT `FK_e3b23d1f1c5a10a90352aee381e` FOREIGN KEY (`room_type_id`) REFERENCES `master_room_types`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_seasons` ADD CONSTRAINT `FK_d553eed6cf3d5f03e46c9bd592b` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_taxes` ADD CONSTRAINT `FK_15422e859d8a1888d3771a252ac` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_transportation_modes` ADD CONSTRAINT `FK_f01f07604f287c05d924509f5eb` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_user_accessible_hotels` ADD CONSTRAINT `FK_a00ea73583a48124606b0316684` FOREIGN KEY (`user_id`) REFERENCES `master_users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_user_accessible_hotels` ADD CONSTRAINT `FK_f4844bdbbdcebed689cb7b94da1` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_user_activity_logs` ADD CONSTRAINT `FK_4c18350bc046982248b5bbefd96` FOREIGN KEY (`sbu_id`) REFERENCES `master_sbu`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `master_user_activity_logs` ADD CONSTRAINT `FK_d14daf838a1921c81a540fdd765` FOREIGN KEY (`user_id`) REFERENCES `master_users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pos_tables` ADD CONSTRAINT `FK_b8d66587e026869edfdcb60f546` FOREIGN KEY (`outlet_id`) REFERENCES `pos_outlets`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation_rooms` ADD CONSTRAINT `FK_54d066b7788c94b9487aec4c0c8` FOREIGN KEY (`reservation_id`) REFERENCES `master_reservations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation_rooms` ADD CONSTRAINT `FK_67b7c9ab5b2f2192916312dd1a5` FOREIGN KEY (`room_type_id`) REFERENCES `master_room_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation_rooms` ADD CONSTRAINT `FK_cdbbce175bcb1a04fc4e972c5ba` FOREIGN KEY (`room_id`) REFERENCES `master_rooms`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation_rooms` ADD CONSTRAINT `FK_f5ec3b8316cc82c7018e8d8f5f0` FOREIGN KEY (`rate_type_id`) REFERENCES `master_rate_types`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation_source_info` ADD CONSTRAINT `FK_2ba9a5c409635239b6f5ab59f3f` FOREIGN KEY (`reservation_id`) REFERENCES `master_reservations`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservation_source_info` ADD CONSTRAINT `FK_63f5c3b8480be2d4fa12d1efa84` FOREIGN KEY (`company_id`) REFERENCES `master_companies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `template_placeholder_mappings` ADD CONSTRAINT `FK_0a8a400646caeb5f21db88cc797` FOREIGN KEY (`template_id`) REFERENCES `master_email_templates`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `template_placeholder_mappings` ADD CONSTRAINT `FK_fabb560c83e91a3aabcd520c1a1` FOREIGN KEY (`placeholder_id`) REFERENCES `template_placeholders`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `FK_3495bd31f1862d02931e8e8d2e8` FOREIGN KEY (`user_id`) REFERENCES `master_users`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `user_permissions` ADD CONSTRAINT `FK_a825263026c77e9bd1d5a9a2760` FOREIGN KEY (`permission_module_id`) REFERENCES `master_permission_modules`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
