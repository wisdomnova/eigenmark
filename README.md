# ProofChain

The machine verifiable rights layer for digital content.

ProofChain enables autonomous agents, creators, and applications to discover content relationships, check usage rights, and settle royalties automatically.

> We do not make AI decide what is legal. We make rights machine readable so AI does not have to guess.

---

## Key Capabilities

1. **Humans** register and verify original creative works.
2. **Applications** query and verify asset provenance records.
3. **AI Agents** check usage permissions before using assets in workflows.
4. **AI Agents** license assets autonomously and settle payments.
5. **Smart Contracts** distribute split royalties to parent and derivative creators.

---

## System Architecture

```
                 PROOFCHAIN
                     │
    ┌────────────────┼────────────────┐
    ▼                ▼                ▼
 Web UI           REST API        MCP Server
    │                │                │
    │                │                ▼
    │                │            AI Agents
    │                │                │
    └────────┬───────┴────────────────┘
             ▼
      ProofChain Core
             │
    ┌────────┴────────┐
    ▼                 ▼
PostgreSQL        Blockchain
(pHash Index)   (Solidity Registry)
```

---

## Core Features

### Exact Identity vs Visual Similarity
* **Cryptographic Hash**: We compute the SHA 256 hash of every uploaded file for absolute identity mapping.
* **Perceptual Hash (pHash)**: We calculate a 64 bit perceptual hash using 2D Discrete Cosine Transform (DCT II) coefficients. This detects visually similar files even if size or format differs.
* **Hamming Distance**: We run SQL similarity queries utilizing a custom popcount function to detect visual matches with 85 percent or greater similarity.

### Provenance Intelligence
Our upload UI analyzes file signatures against the database. If a similar asset exists, the system flags it as a potential derivative, offering choices to **Declare as derivative** (establishing parent links) or **Register as independent work**.

---

## Model Context Protocol (MCP) Tools

The ProofChain MCP server exposes high level domain capabilities to agents:

1. **`verify_provenance`**: Resolves registration details, creator address, block timestamp, and origin parent lineage history.
2. **`find_related_assets`**: Performs visual similarity checks based on Hamming distance.
3. **`get_license`**: Returns licensing price, split rules, and parent creator wallet details.
4. **`check_usage`**: Resolves whether a specific use case (commercial, derivative) is allowed and returns expected royalty splits.
5. **`license_asset`**: Returns structured transaction parameters for split payment execution.

---

## Getting Started

### Local Setup
1. Install package dependencies:
   ```bash
   npm install
   ```

2. Run local database schema migrations:
   ```bash
   psql -d proofchain -f schema.sql
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

### Running Test Suites

* **Smart Contract Tests**:
  ```bash
  npx hardhat test
  ```

* **MCP Server Integration Tests**:
  ```bash
  cd mcp-server && node test-client.js
  ```
