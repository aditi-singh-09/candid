/* eslint-disable */

// contractClient.ts
import { WalletApi } from "./midnightWallet";
import deployedContract from "../../deployed_contract.json";
import { blake2b } from "@noble/hashes/blake2b";

export interface DeploymentInfo {
  network: string;
  address: string | null;
}

export function getDeployment(): DeploymentInfo {
  return { network: deployedContract.network || "preprod", address: deployedContract.address || (deployedContract as any).contractAddress };
}

export function isDeployed(): boolean {
  return Boolean(getDeployment().address);
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

export async function submitFeedback(params: SubmitFeedbackParams): Promise<TxResult> {
  if (!isDeployed()) {
    throw new Error("No contract is deployed yet.");
  }
  
  const contractAddress = getDeployment().address!;

  // Dynamic imports for Midnight SDK
  const [
    { indexerPublicDataProvider },
    { httpClientProofProvider },
    { levelPrivateStateProvider },
    { FetchZkConfigProvider },
    { findDeployedContract },
    { CompiledContract },
    { CompiledSurveyContract },
    { setNetworkId },
    { Transaction },
    { toHex, fromHex },
  ] = await Promise.all([
    import("@midnight-ntwrk/midnight-js-indexer-public-data-provider"),
    import("@midnight-ntwrk/midnight-js-http-client-proof-provider"),
    import("@midnight-ntwrk/midnight-js-level-private-state-provider"),
    import("@midnight-ntwrk/midnight-js-fetch-zk-config-provider"),
    import("@midnight-ntwrk/midnight-js-contracts"),
    import("@midnight-ntwrk/midnight-js-protocol/compact-js"),
    import("@midnight-ntwrk/bboard-contract" as any),
    import("@midnight-ntwrk/midnight-js-network-id"),
    import("@midnight-ntwrk/midnight-js-protocol/ledger"),
    import("@midnight-ntwrk/midnight-js-utils"),
  ]);

  setNetworkId("preprod");

  const indexerHttp = "https://indexer.preprod.midnight.network/api/v4/graphql";
  const indexerWs = "wss://indexer.preprod.midnight.network/api/v4/graphql/ws";
  const zkConfigPath = `${window.location.origin}/managed/survey`;

  const secretBytes = hexToBytes(params.respondentSecret.padStart(64, "0").slice(0, 64));

  interface WitnessContext<PS> {
    privateState: PS;
  }

  const dummyPath = Array.from({ length: 10 }, () => new Uint8Array(32));
  const dummyDirections = Array.from({ length: 10 }, () => false);

  const witnesses = {
    respondentSecret: <PS>(context: WitnessContext<PS>): [PS, Uint8Array] => [
      context.privateState,
      secretBytes,
    ],
    merklePath: <PS>(context: WitnessContext<PS>): [PS, Uint8Array[]] => [
      context.privateState,
      dummyPath,
    ],
    pathDirections: <PS>(context: WitnessContext<PS>): [PS, boolean[]] => [
      context.privateState,
      dummyDirections,
    ],
    hasComment: <PS>(context: WitnessContext<PS>): [PS, boolean] => [
      context.privateState,
      params.hasComment,
    ],
  };

  const zkConfigProvider = new FetchZkConfigProvider(zkConfigPath, (input: RequestInfo | URL, options?: RequestInit) => {
    let url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    const bust = url.includes("?") ? `&v=${Date.now()}` : `?v=${Date.now()}`;
    return fetch(url + bust, options);
  });
  
  const walletConfig = params.wallet.serviceUriConfig ? await params.wallet.serviceUriConfig() : undefined;
  const ONEAM_PROOF_SERVER = walletConfig?.proverServerUri || "https://api-preprod.1am.xyz";
  
  let proofProvider = httpClientProofProvider(ONEAM_PROOF_SERVER, zkConfigProvider);

  let shieldedCoinPk = "0000000000000000000000000000000000000000000000000000000000000000";
  let shieldedEncPk = "0000000000000000000000000000000000000000000000000000000000000000";
  
  const api = params.wallet as any;
  if (typeof api?.getShieldedAddresses === "function") {
    try {
      const addresses = await api.getShieldedAddresses();
      if (addresses?.shieldedCoinPublicKey) shieldedCoinPk = addresses.shieldedCoinPublicKey;
      if (addresses?.shieldedEncryptionPublicKey) shieldedEncPk = addresses.shieldedEncryptionPublicKey;
    } catch (e) {}
  }

  const privateStateProvider = levelPrivateStateProvider({
    privateStateStoreName: `survey-private-${shieldedCoinPk.slice(0, 8)}`,
    signingKeyStoreName: `survey-signing-${shieldedCoinPk.slice(0, 8)}`,
    privateStoragePasswordProvider: () => "TempPassword123!Secure",
    accountId: shieldedCoinPk,
  });

  const walletProvider = {
    getCoinPublicKey: () => shieldedCoinPk,
    getEncryptionPublicKey: () => shieldedEncPk,
    balanceTx: async (tx: any, _ttl?: Date) => {
      const serializedTx = toHex(tx.serialize());
      if (typeof api?.balanceUnsealedTransaction === "function") {
        try {
          const received = await api.balanceUnsealedTransaction(serializedTx);
          return Transaction.deserialize("signature", "proof", "binding", fromHex(received.tx)) as any;
        } catch (e) {
           console.warn("Wallet balance failed", e);
        }
      }
      
      const balanceResp = await fetch(`${ONEAM_PROOF_SERVER}/balance-only`, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: tx.serialize(),
      });
      if (balanceResp.ok) {
        const { txBytes: balancedHex } = await balanceResp.json();
        return Transaction.deserialize("signature", "proof", "binding", fromHex(balancedHex)) as any;
      }
      throw new Error(`balance-only failed`);
    }
  };

  let submittedTxId: string | null = null;
  const midnightProvider = {
    submitTx: async (tx: any) => {
      const txBytes = tx.serialize();
      const txHex = toHex(txBytes);
      const computedHash = toHex(blake2b(txBytes, { dkLen: 32 }));
      
      if (typeof api?.submitTransaction === "function") {
        const res = await api.submitTransaction(txHex);
        let returnedId: string | null = null;
        if (typeof res === "string") {
          returnedId = res;
        } else if (typeof res === "object" && res !== null) {
          returnedId = res.txHash || res.hash || res.transactionHash || res.txId || res.id;
        }
        submittedTxId = (returnedId || computedHash).replace(/^0x/, "");
        return submittedTxId;
      }
      throw new Error("No submit method");
    }
  };

  const providers = {
    privateStateProvider,
    publicDataProvider: indexerPublicDataProvider(indexerHttp, indexerWs),
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider,
  };

  const withWitnessesFn = CompiledContract.withWitnesses as any;
  const compiledContract = withWitnessesFn(witnesses)(CompiledSurveyContract);

  const contract = await findDeployedContract(providers, {
    contractAddress: contractAddress,
    compiledContract,
    privateStateId: `survey-${params.respondentSecret.slice(0, 16)}`,
    initialPrivateState: { secretKey: secretBytes },
  });

  try {
    const callPromise = (contract as any).callTx.submitFeedback(BigInt(params.rating));
  const earlyReturnPromise = new Promise<{ early: true }>((resolve) => {
    const check = setInterval(() => {
      if (submittedTxId) {
        clearInterval(check);
        setTimeout(() => resolve({ early: true }), 2000);
      }
    }, 500);
  });

  await Promise.race([callPromise, earlyReturnPromise]);
  const finalTxId = submittedTxId || "0000000000000000000000000000000000000000000000000000000000000000";

  return {
    txHash: finalTxId,
    explorerUrl: `https://explorer.1am.xyz/tx/${finalTxId.replace(/^0x/, "")}?network=preprod`,
  };
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

