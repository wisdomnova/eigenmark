/* Eigenmark Database Schema */
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
  content_hash VARCHAR(66) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creator_address VARCHAR(42) NOT NULL,
  ai_model VARCHAR(100),
  license_terms_hash VARCHAR(66) NOT NULL,
  parent_hash VARCHAR(66) REFERENCES assets(content_hash),
  phash VARCHAR(16) NOT NULL,
  royalty_split NUMERIC(5, 2) DEFAULT 10.00 NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS licensing_agreements (
  id SERIAL PRIMARY KEY,
  asset_hash VARCHAR(66) REFERENCES assets(content_hash),
  licensee_address VARCHAR(42) NOT NULL,
  transaction_hash VARCHAR(66) UNIQUE NOT NULL,
  price NUMERIC(20, 6) NOT NULL,
  royalty_split NUMERIC(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to compute Hamming distance between two hex-encoded 64-bit pHashes
CREATE OR REPLACE FUNCTION hamming_distance(hash1 VARCHAR(16), hash2 VARCHAR(16))
RETURNS INT AS $$
DECLARE
  bits1 BIT(64);
  bits2 BIT(64);
  xor_result BIT(64);
BEGIN
  IF hash1 IS NULL OR hash2 IS NULL OR length(hash1) <> 16 OR length(hash2) <> 16 THEN
    RETURN 64; -- Max distance if invalid
  END IF;
  
  EXECUTE 'SELECT x' || quote_literal(hash1) || '::bit(64)' INTO bits1;
  EXECUTE 'SELECT x' || quote_literal(hash2) || '::bit(64)' INTO bits2;
  
  xor_result := bits1 # bits2;
  RETURN length(replace(xor_result::text, '0', ''));
END;
$$ LANGUAGE plpgsql IMMUTABLE;
