// contractClient.ts
//
// The single place the UI submits a transaction. Not a local ledger
// simulator — no in-memory state pretends to be the chain. It:
//
//   1) Reports whether a real contract is deployed (from
//      deployed_contract.json — see docs/USAGE.md).
//   2) Once deployed, is where you wire the private witnesses built
//      with src/lib/crypto.ts to a real circuit call through the
//      connected wallet, using the bindings `compact compile` writes
//      into `managed/survey`.
//
// The exact provider/contract-instance API differs across
// @midnight-ntwrk/midnight-js-contracts releases, so step 2 is left as
// a single clearly-marked function rather than guessed at — see
// docs/USAGE.md "Going from stub to live calls", which points at
// Midnight's official example-counter reference dApp to mirror.

import deployedContract from "../../deployed_contract.json";
import { WalletApi } from "./midnightWallet";

export interface DeploymentInfo {
  network: string;
  address: string | null;
}

export function getDeployment(): DeploymentInfo {
  return { network: deployedContract.network, address: deployedContract.address };
}

export function isDeployed(): boolean {
  return Boolean(deployedContract.address);
}

export interface SubmitFeedbackParams {
  wallet: WalletApi;
  respondentSecret: string;
  rating: number;
  hasComment: boolean;
}

export interface TxResult {
  txHash: string;
  explorerUrl: string;
}

// ---------------------------------------------------------------------
// LIVE CALL — wire this to your generated managed/survey bindings.
// ---------------------------------------------------------------------
// Throws until the live wiring is done, rather than returning a
// fabricated result — there is no synthetic transaction hash anywhere
// in this codebase.
export async function submitFeedback(_params: SubmitFeedbackParams): Promise<TxResult> {
  if (!isDeployed()) {
    throw new Error(
      "No contract is deployed yet. Run `compact compile`, deploy to Preprod, and fill in deployed_contract.json."
    );
  }
  throw new Error(
    "Live circuit call not wired yet — see docs/USAGE.md 'Going from stub to live calls' for the exact steps once you've pinned a Midnight.js SDK version."
  );
}
