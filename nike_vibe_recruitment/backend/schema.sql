-- [LexGuard] Table Schema for Turso Database
-- Compliant with UU PDP: Supports Biometric Data Encryption and Implicit Auto-Deletion

CREATE TABLE candidates (
    kandidat_id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    vibe_score DECIMAL(5,2),
    discipline_index DECIMAL(5,2),
    consent_granted BOOLEAN DEFAULT FALSE
);

CREATE TABLE biometric_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kandidat_id VARCHAR(255) NOT NULL,
    -- AES-256 Encrypted blob for sensitive biometrics (e.g., Apple Health / NRC stream)
    encrypted_biometric_payload TEXT NOT NULL,
    -- Initialization Vector corresponding to the payload
    iv TEXT NOT NULL,
    -- TTL / Execution Date for Auto-Deletion Engine
    deletion_timestamp DATETIME NOT NULL,
    FOREIGN KEY(kandidat_id) REFERENCES candidates(kandidat_id)
);

CREATE TABLE compliance_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    kandidat_id VARCHAR(255),
    action_type VARCHAR(100), -- 'DATA_INGESTION', 'DATA_DELETION', 'CONSENT_GRANTED'
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) -- 'SUCCESS', 'FAILED'
);
