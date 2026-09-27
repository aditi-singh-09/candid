// midnightWallet.ts
//
// Real integration against the Midnight DApp Connector API. Wallets
// (Lace, 1AM, and any other Midnight-compatible wallet) inject
// themselves onto `window.midnight` — a flat object keyed by an
// arbitrary id, each value exposing `name`, `apiVersion`, `isEnabled()`,
// `enable()`, and (once enabled) `state()` / `serviceUriConfig()`.
// Reference: https://docs.midnight.network/blog/connect-dapp-lace-wallet
// and the DApp Connector API reference.
//
// No fallback "demo wallet" here. If no wallet is installed, connect()
// reports that honestly rather than inventing an address.

export interface InjectedWallet {
  name: string;
  apiVersion: string;
  isEnabled: () => Promise<boolean>;
  enable: () => Promise<WalletApi>;
}

export interface WalletApi {
  state: () => Promise<{ address: string }>;
  serviceUriConfig?: () => Promise<{
    nodeUri: string;
    indexerUri: string;
    proverServerUri: string;
  }>;
}

declare global {
  interface Window {
    midnight?: Record<string, InjectedWallet>;
  }
}

export type WalletStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "unavailable"
  | "error";

export function listInjectedWallets(): Array<{ id: string; wallet: InjectedWallet }> {
  if (!window.midnight) return [];
  return Object.entries(window.midnight).map(([id, wallet]) => ({ id, wallet }));
}

export async function connectWallet(walletId?: string): Promise<{
  address: string;
  walletName: string;
  api: WalletApi;
  serviceUriConfig?: { nodeUri: string; indexerUri: string; proverServerUri: string };
}> {
  const wallets = listInjectedWallets();
  if (wallets.length === 0) {
    throw new Error(
      "No Midnight-compatible wallet was detected. Install Lace or 1AM Wallet, configured for Preprod, and reload."
    );
  }

  const target = walletId ? wallets.find((w) => w.id === walletId) : wallets[0];
  if (!target) {
    throw new Error("The requested wallet is not installed.");
  }

  let api;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (target.wallet as any).connect === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api = await (target.wallet as any).connect('preprod');
  } else {
    api = await target.wallet.enable();
  }

  let address = "";
  let serviceUriConfig;

  // Handle both the older DApp Connector (v3) and the newer (v4) API formats
  if (typeof api.state === 'function') {
    const state = await api.state();
    address = state.address;
    serviceUriConfig = api.serviceUriConfig ? await api.serviceUriConfig() : undefined;
  } else if (typeof api.getShieldedAddresses === 'function') {
    const addresses = await api.getShieldedAddresses();
    address = addresses.shieldedAddress;
    
    if (typeof api.getConfiguration === 'function') {
      const config = await api.getConfiguration();
      serviceUriConfig = {
        nodeUri: config.substrateNodeUri,
        indexerUri: config.indexerUri,
        proverServerUri: config.proverServerUri || 'http://localhost:6300'
      };
    }

    // Polyfill the expected methods so downstream types are happy
    api.state = async () => ({ address });
    api.serviceUriConfig = async () => serviceUriConfig;
  }

  return { address, walletName: target.wallet.name, api, serviceUriConfig };
}
