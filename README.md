# 🦦 OtterProof

> Decentralized Data Validation Layer for the Sui + Walrus Ecosystem.

OtterProof is a verifiable data quality protocol. It allows data providers to prove their datasets are schema-compliant, complete, and privacy-safe before storing them on Walrus. By generating on-chain attestations on Sui, OtterProof creates a trust layer for decentralized AI and data marketplaces.

## Key Features

*   **Decentralized Validation (Tusk SDK)**: Runs validation logic purely in the browser or client-side, removing the need for centralized backend servers.
*   **Walrus Integration**: Seamlessly uploads data to Walrus decentralized storage and generates verifiable references (Blob IDs).
*   **Sui Attestation**: Mints on-chain "Quality Certificates" as Sui Objects, linking the Walrus Blob ID with a cryptographic proof of validation.
*   **Privacy-First**: Data content is validated locally; only the proofs and metadata are anchored on-chain.

## Architecture

The project has been optimized into a lean, decentralized architecture:

```mermaid
graph LR
    User[User / Data Provider] -->|Uploads Data| Web[Next.js dApp]
    Web -->|1. Store Blob| Walrus[Walrus Storage]
    Walrus -->|Blob ID| Web
    Web -->|2. Validate (Tusk SDK)| Tusk[Local Validation Engine]
    Tusk -->|3. Build Transaction| Wallet[Sui Wallet]
    Wallet -->|4. Sign & Mint| Sui[Sui Blockchain]
```

## Project Structure

This is a Monorepo managed by `pnpm`:

```bash
otterproof/
├── apps/
│   └── web/           # Next.js dApp (The Playground)
├── packages/
│   └── tusk-sdk/      # TypeScript SDK for validation & transaction building
├── package.json
└── pnpm-workspace.yaml
```

## Getting Started

### Prerequisites
*   Node.js >= 18
*   pnpm
*   Sui Wallet Browser Extension (configured to **Testnet**)

### Installation

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm build
```

### Running the dApp

Since the architecture is now serverless (client-side only), you only need to start the web application:

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage Guide (Playground)

1.  **Connect Wallet**: Click the "Connect Wallet" button and approve the connection in your Sui Wallet.
2.  **Upload Data**:
    *   Drag & Drop a CSV or JSONL file.
    *   Or click **"Use Sample Data"** to load a pre-configured dataset.
3.  **Validate**: Click **"Upload to Walrus & Validate"**.
    *   The file will be uploaded to Walrus Testnet.
    *   The Tusk SDK will validate the data structure against the selected Schema.
4.  **Attest**:
    *   Review the generated Quality Report.
    *   Click **"Sign & Mint Attestation"**.
    *   Approve the transaction in your wallet.
5.  **Verify**:
    *   Once confirmed, you will see a "Notarized" receipt with links to the Sui Explorer.

## Tech Stack

*   **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
*   **Blockchain**: @mysten/sui, @mysten/dapp-kit
*   **Validation**: Ajv (JSON Schema), Tusk SDK (Custom)
*   **Storage**: Walrus Protocol (HTTP Aggregator/Publisher)

## License

MIT
