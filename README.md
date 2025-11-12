# 🦦 OtterProof

> Data validation and on-chain notarization for Sui + Walrus ecosystems.

OtterProof is a decentralized data validation layer that inspects CSV/JSONL datasets, scores their quality, produces machine-readable reports, and anchors proofs on-chain. It gives AI data marketplaces, storage providers, and Web3 builders a repeatable way to prove that every dataset is complete, well-structured, and privacy-safe before it moves downstream.

## Table of Contents
- [🦦 OtterProof](#-otterproof)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Installation](#installation)
    - [Development](#development)
  - [Configuration](#configuration)
  - [Available Scripts](#available-scripts)
  - [Roadmap](#roadmap)
  - [Contributing](#contributing)
  - [License](#license)
  - [Further Reading](#further-reading)

## Overview
- **Purpose:** act as the trusted "data validation layer" between Walrus storage and Sui smart contracts.
- **Core Workflow:** upload schema → upload dataset → run automated checks → publish report to Walrus → commit report digest to Sui → share verifiable link with consumers.
- **Status:** Day 3 prototype — validation engine now exposes Walrus uploads + Sui digest anchoring behind the new `publish` flag. The legacy Chinese project brief lives in `docs/project-plan.zh.md`.

## Key Features
- **Composable schema templates** — define reusable field constraints, regex guards, and privacy rules powered by JSON Schema + Move definitions.
- **Streaming validation service** — Fastify/Node pipeline parses large CSV/JSONL files, measures missing/duplicate rates, and flags privacy hits without loading the entire dataset into memory.
- **Report generator** — outputs deterministic JSON payloads along with visual summaries for the web dashboard.
- **Walrus & Sui anchoring** — (Day 3) Fastify API can now push reports to Walrus and synthesize Sui digests on demand when clients set the `publish` flag.
- **Wallet-ready Web UI** — Next.js front-end for uploading data, reviewing scores, and signing on-chain submissions with Sui wallets.
- **Privacy-aware mode** — optional encrypted payloads (future Seal integration) for sensitive datasets.

## Architecture
```
┌───────────────┐     Upload & sign     ┌──────────────┐
│ Next.js Web   │ ─────────────────────▶ │ Fastify API  │
│ app (apps/web)│ ◀───── Status/Reports  │ validator    │
└──────┬────────┘                        └────┬─────────┘
       │ JSON reports / refs                   │ Digest + refs
       ▼                                       ▼
┌──────────────┐                       ┌─────────────────┐
│ Walrus store │ ◀────── report blob ─ │ Sui Move module │
└──────────────┘                       └─────────────────┘
```

- **apps/web** — Next.js + Tailwind dashboard with wallet integration and report visualization.
- **apps/api** — Fastify service handling schema registry, validation jobs, scoring, and Walrus uploads.
- **packages/move** — Sui Move module that records schema definitions, datasets, and report proofs.

## Project Structure
```
otterproof/
├── apps/
│   ├── web/   # Next.js front-end
│   └── api/   # Fastify validation service
├── packages/
│   └── move/  # Sui Move contracts
├── docs/      # Documentation (includes legacy Chinese brief)
├── docker-compose.yml
├── pnpm-workspace.yaml
└── package.json
```

## Getting Started
### Requirements
- Node.js >= 18.17 (use `nvm` or `fnm` if needed)
- pnpm 9.12+ (`corepack enable pnpm` recommended)
- Sui CLI + Walrus CLI for interacting with dev/test networks (optional during UI/API dev)

### Installation
```bash
pnpm install
```

### Development
- Run everything: `pnpm dev` (spawns `apps/*` dev servers in parallel).
- Web only: `pnpm dev:web` then visit [http://localhost:3000](http://localhost:3000).
- API only: `pnpm dev:api` (Fastify on port 4000 by default).
- Docker alternative: `docker-compose up api web` to run both services inside Node 20 containers with shared source mounts.

## Configuration
Copy `.env.example` to `.env` (root or per service) and adjust:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Web app base URL for calling the Fastify API. |
| `PORT` | API listening port. |
| `LOG_LEVEL` | Fastify log verbosity (`info`, `debug`, etc.). |
| `WALRUS_ENDPOINT` | Walrus RPC endpoint for uploading report blobs. |
| `SUI_RPC` | Sui fullnode endpoint used by the API and CLI scripts. |

## Available Scripts
Use pnpm from the repo root:

| Command | Description |
| --- | --- |
| `pnpm dev` | Start all workspaces in watch mode. |
| `pnpm build` | Build every package/app. |
| `pnpm lint` | Run shared lint rules across the monorepo. |
| `pnpm test` | Execute workspace tests (Vitest/Jest). |
| `pnpm typecheck` | Run TypeScript builds for all projects. |
| `pnpm format` | Apply formatting presets (Prettier/ESLint). |

## Roadmap
Roadmap milestones for the hackathon sprint are tracked in `docs/project-plan.zh.md`. High-level goals:
1. Stand up monorepo scaffolding and Move contract skeleton.
2. Ship validation engine with schema registry and scoring.
3. Integrate Walrus storage + Sui on-chain proofs.
4. Polish UI/UX with wallet flows and reporting visualizations.
5. Harden with tests, docs, and demo assets.

## Contributing
Contributions are welcome! Please:
1. Fork and create a branch (`feat/<name>`).
2. Run `pnpm lint && pnpm test` before opening a PR.
3. Describe validation steps and any Walrus/Sui hashes referenced.

## License
MIT

## Further Reading
- Legacy Chinese narrative, architecture notes, and 5-day sprint plan: [`docs/project-plan.zh.md`](docs/project-plan.zh.md)
- Sui Move language docs: https://docs.sui.io/
- Walrus storage docs: https://walrus.io/docs

> 🦦 OtterProof — Where data gets smartly verified.
