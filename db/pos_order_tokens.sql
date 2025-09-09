CREATE TABLE order_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    token_number VARCHAR(20) NOT NULL,  -- e.g. T001, T002
    type ENUM('KOT', 'BILL') DEFAULT 'KOT', -- kitchen token or bill token
    status ENUM('NEW', 'PRINTED', 'SERVED', 'CANCELLED') DEFAULT 'NEW',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_order_token FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);