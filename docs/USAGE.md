# Usage notes

## Circuit walkthrough (`contracts/survey.compact`)

- `openSurvey(title, root)` — organizer opens the survey and publishes
  the Merkle root of every eligible respondent's hashed secret (e.g.
  verified event attendees or ticket holders).
- `submitFeedback(rating)` — a respondent supplies three private
  witnesses (`respondentSecret`, `respondentPath`, `commentText`). The
  circuit proves membership against `eligibilityRoot`, derives a
  survey-scoped nullifier, checks it hasn't been spent, then increments
  only the public rating counter (and the comment counter, if a comment
  was attached — its content never touches the ledger).
- `closeSurvey()` — freezes further responses without altering the
  aggregates.

## Going from stub to live calls (real on-chain transactions)

This repo ships with **no simulated ledger**. `src/lib/contractClient.ts`
throws until you complete this wiring — it will never return a
fabricated transaction hash.

1. Install the Midnight `compact` CLI and run
   `npm run compact:compile` — this populates `managed/survey` with the
   generated TypeScript bindings and verifier keys.
2. Build the eligibility Merkle tree off-chain from your real
   respondents' hashed secrets, and deploy the contract with
   `openSurvey` called against that root. Record the resulting Preprod
   contract address in `deployed_contract.json` and in `README.md`.
3. In `src/lib/contractClient.ts`, replace the body of
   `submitFeedback` with a real call against your generated
   `managed/survey` bindings, using
   `@midnight-ntwrk/midnight-js-contracts` (`findDeployedContract` +
   a `callTx` against the `submitFeedback` circuit). The exact provider
   construction (indexer/node/proof-server URIs, taken from
   `walletApi.serviceUriConfig()`) varies slightly by SDK version —
   mirror Midnight's official `example-counter` reference dApp, which
   demonstrates the full deploy-and-call pattern end to end:
   https://docs.midnight.network (see "Examples" in the sidebar).
4. Once wired, `FeedbackBooth`'s submit button will send a real
   wallet-signed transaction and should surface the returned tx hash —
   add an explorer link (Preprod Midnight Explorer or 1AM Explorer)
   next to the success state.

## Manual steps still required before submission

- [ ] Compile the contract and deploy to Preprod with a real eligibility root
- [ ] Wire `submitFeedback` to the generated bindings (step 3 above)
- [ ] Add the real Preprod contract address to `README.md` and `deployed_contract.json`
- [ ] Fill in every `[I WILL FILL THIS IN]` section of `PROPOSAL.md`
- [ ] Submit the chosen idea (Anonymous Feedback / Survey) for approval
- [ ] Record the 1-minute demo video showing a real transaction (see checklist below)
- [ ] Make 10+ meaningful, incremental commits
- [ ] Deploy the frontend (e.g. Vercel/Netlify) and add the live URL

## Demo video checklist
1. Full flow: connect a real wallet → generate a respondent secret →
   submit a rating → show the resulting transaction on a Preprod explorer
2. Terminal showing `npm test` output (12 passing)
3. README showing the green CI badge
