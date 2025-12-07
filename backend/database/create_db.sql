-- create database and user (run as MySQL root)
CREATE DATABASE latif_jewels CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- (Optional) create a dedicated MySQL user for the app:
CREATE USER 'latif_app'@'localhost' IDENTIFIED BY 'StrongPasswordHere';
GRANT ALL PRIVILEGES ON latif_jewels.* TO 'latif_app'@'localhost';
FLUSH PRIVILEGES;

USE latif_jewels;

-- admin users table
CREATE TABLE admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- rates table
CREATE TABLE rates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gold_per_tola DECIMAL(12,3) NOT NULL,
  gold_per_gram DECIMAL(12,3) NOT NULL,
  silver_per_tola DECIMAL(12,3) NOT NULL,
  silver_per_gram DECIMAL(12,3) NOT NULL,
  updated_by INT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert initial rates (example)
INSERT INTO rates (gold_per_tola, gold_per_gram, silver_per_tola, silver_per_gram)
VALUES (400000.000, 13594.117, 5000.000, 170.0);

-- You will create admin user using the Flask script (to hash password).


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123root123';
CREATE USER 'root'@'%' IDENTIFIED BY 'root123root123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;

