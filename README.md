# Candid
![CI](https://github.com/YOUR_USERNAME/candid/actions/workflows/ci.yml/badge.svg)
> Verifiable participation, private responses. Built on Midnight.

## Live Demo
[LIVE URL — add after deploying, e.g. Vercel/Netlify]

## Contract Address
| Network  | Address                          |
|----------|-----------------------------------|
| Preprod  | `[CONTRACT ADDRESS — REQUIRED]`    |

## What This Does
Candid lets an organizer run a survey where every response is
provably from an eligible, un-reused respondent, while the response
itself — the rating and any free-text comment — is never linked back
to that respondent. Only the aggregate 1-5 star distribution and a
comment count are ever public.

## No mock data — architecture note
This build has **no local ledger simulator**. `src/lib/contractClient.ts`
refuses to fabricate a transaction result: every action either goes
through a connected wallet against a real deployed contract, or the UI
tells you plainly that nothing is deployed yet. See docs/USAGE.md for
the exact steps to wire it up to a live Preprod deployment.

## Privacy Model
- **PUBLIC:** the survey title, the aggregate rating distribution, how
  many responses included a comment, the set of spent nullifiers,
  open/closed status.
- **PRIVATE:** the respondent's eligibility secret, which respondent
  gave which rating, the full text of every comment, and any
  wallet-to-response linkage.
- **PROVED without revealing:** that the caller is an eligible
  respondent and has not answered this survey before — without
  revealing who they are or what they wrote.

## Privacy Claim
An on-chain observer can see the exact star-rating breakdown at any
moment, and can confirm no respondent answered twice (the nullifier
set only grows). What they cannot see, at any point, is whose secret
produced which rating, or anything about comment content — comments
never touch the ledger; only whether one accompanied a response is
counted.

## Tech Stack
- **Contract:** Compact (`contracts/survey.compact`) — Midnight's ZK
  smart contract language
- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Wallet:** Midnight DApp Connector API (Lace, 1AM, or any compatible
  wallet — multi-wallet detection, no hardcoded provider)
- **Tests:** Vitest, covering the pure witness-derivation helpers used
  to build real transactions
- **CI/CD:** GitHub Actions

## Prerequisites
- Node.js v22+
- npm
- [Midnight `compact` CLI](https://docs.midnight.network) (for compiling
  the contract and deploying to Preprod)
- A Midnight-compatible wallet (Lace or 1AM), funded on Preprod

## Setup & Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Compile the contract (requires the Midnight toolchain)
npm run compact:compile

# 3. Run the app
npm run dev
```
Until `deployed_contract.json` has a real address and
`src/lib/contractClient.ts`'s live-call section is wired to your
compiled `managed/survey` bindings (see docs/USAGE.md), the app runs
but honestly reports that no contract is deployed rather than
simulating one.

## Run Tests
```
npm test
```

## CI/CD
On every push and pull request to `main`, the GitHub Actions pipeline
(`.github/workflows/ci.yml`) checks out the code, installs dependencies
on Node 22, compiles the Compact contract when the toolchain is present,
lints, runs the full Vitest suite, and produces a production build —
failing the run if any step errors.

## Product Proposal
See [PROPOSAL.md](./PROPOSAL.md).
