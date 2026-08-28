/* ProofChain Database Schema */
/* PostgreSQL migration script */

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS assets (
  id SERIAL PRIMARY KEY,
  content_hash VARCHAR(64) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creator_address VARCHAR(42) NOT NULL,
  ai_model VARCHAR(100),
  license_terms_hash VARCHAR(64) NOT NULL,
  parent_id INT REFERENCES assets(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS licensing_agreements (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id),
  licensee_address VARCHAR(42) NOT NULL,
  transaction_hash VARCHAR(66) UNIQUE NOT NULL,
  price NUMERIC(20, 6) NOT NULL,
  royalty_split NUMERIC(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
