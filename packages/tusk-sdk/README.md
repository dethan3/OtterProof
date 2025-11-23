# @otterlabs/tusk

> **The sharpest data validation layer for Walrus.**

TypeScript SDK for interacting with the Tusk protocol - a data validation and attestation system built on Sui for Walrus Protocol blobs.

## Installation

```bash
pnpm add @otterlabs/tusk
```

## Quick Start

```typescript
import { Tusk } from '@otterlabs/tusk';

// Initialize the Tusk client
const tusk = new Tusk('testnet', process.env.TUSK_PACKAGE_ID!);

// Register a schema
await tusk.registerSchema({
  name: 'AI Dataset Schema',
  version: '1.0',
  schema: {
    type: 'object',
    properties: {
      instances: { type: 'number' },
      labels: { type: 'array' }
    },
    required: ['instances', 'labels']
  }
});

// Validate a Walrus blob and create attestation
const isValid = await tusk.pierceAndValidate(
  'blob-id-123',
  schemaId,
  walrusBlobData
);

if (isValid) {
  await tusk.attest(blobId, schemaId);
}
```

## Features

- ✅ **Schema Registration**: Register JSON schemas on-chain
- ✅ **Blob Validation**: Validate Walrus blob data against schemas
- ✅ **Attestation**: Create on-chain quality certificates
- ✅ **Type-Safe**: Fully typed TypeScript SDK

## Commands

```bash
# Build the SDK
pnpm build

# Run the demo
pnpm demo
```

## Documentation

See the main [Tusk documentation](../README.md) for more details.

---

Built with ❤️ by **OtterLabs**
