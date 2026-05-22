CREATE DATABASE IF NOT EXISTS maintenance_tracker;
USE maintenance_tracker;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('resident', 'technician', 'admin') NOT NULL,
    contact_info VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    technician_id INT,
    category ENUM('Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Appliance Repair', 'Other') NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    media VARCHAR(255),
    status ENUM('New', 'Assigned', 'In-Progress', 'Resolved') DEFAULT 'New',
    feedback_rating INT CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES users(id),
    FOREIGN KEY (technician_id) REFERENCES users(id)
);
