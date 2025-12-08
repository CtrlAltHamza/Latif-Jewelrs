USE railway;

CREATE TABLE rates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gold_per_tola DECIMAL(10, 2) DEFAULT 0.00,
    gold_per_gram DECIMAL(10, 2) DEFAULT 0.00,
    silver_per_tola DECIMAL(10, 2) DEFAULT 0.00,
    silver_per_gram DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO rates (gold_per_tola, gold_per_gram, silver_per_tola, silver_per_gram) 
VALUES (100.00, 5.50, 80.00, 1.25);

INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'pbkdf2:sha256:600000$YOUR_HASH');