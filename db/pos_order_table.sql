CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    uuid CHAR(36) NOT NULL UNIQUE,
    order_number VARCHAR(50) NOT NULL UNIQUE, -- like INV-0001 or POS-123
    token_number VARCHAR(20),                -- display token for counter

    outlet_id BIGINT NOT NULL,
    table_id BIGINT NULL,                    -- for dine-in, null for takeaway/delivery
    waiter_id BIGINT NULL,
    customer_id BIGINT NULL,                 -- optional (walk-in vs registered)

    order_type ENUM('DINE_IN', 'TAKE_AWAY', 'PICKUP', 'ROOM_SERVICE') NOT NULL,

    subtotal DECIMAL(12,2) DEFAULT 0,
    discount DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    service_charge DECIMAL(12,2) DEFAULT 0,
    grand_total DECIMAL(12,2) DEFAULT 0,

    status ENUM('PENDING', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED', 'HOLD') DEFAULT 'PENDING',
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID') DEFAULT 'UNPAID',

    created_by BIGINT,
    updated_by BIGINT,
    deleted_by BIGINT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);