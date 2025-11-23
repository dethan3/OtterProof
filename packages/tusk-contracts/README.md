# Tusk Protocol - Smart Contracts

Sui Move smart contracts for the Tusk Protocol schema registry.

## Package Information

- **Package Name**: `tusk_protocol`
- **Module**: `tusk::registry`
- **Network**: Sui Testnet

## Structure

The contract provides:

### Data Structures

1. **Schema**: Registered data schemas with JSON content
2. **Attestation**: Quality certificates for validated Walrus blobs
3. **SchemaRegistry**: Central registry tracking all schemas

### Functions

- `register_schema()`: Register a new data schema on-chain
- `create_attestation()`: Mint a quality certificate after validation

## Deployment

### Prerequisites

```bash
# Install Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

### Deploy to Testnet

```bash
cd contracts

# Build the contract
sui move build

# Deploy to Sui Testnet
sui client publish --gas-budget 100000000

# Save the package ID from the output
# Update the SDK .env file with: TUSK_PACKAGE_ID=<package-id>
```

### After Deployment

1. Copy the **Package ID** from the deployment output
2. Update `/sdk/.env` with the Package ID
3. Note the **SchemaRegistry** shared object ID for future interactions

## Testing

```bash
# Run Move tests
sui move test
```

---

Built by **OtterLabs** for the Walrus Protocol ecosystem.
