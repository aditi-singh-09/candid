import { WalletStatus } from "../lib/midnightWallet";

function truncate(addr: string) {
  return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
}

export function Header({
  status,
  address,
  walletName,
  error,
  onConnect,
  onDisconnect,
}: {
  status: WalletStatus;
  address: string | null;
  walletName: string | null;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <header className="border-b border-chalk/10">
      <div className="mx-auto max-w-3xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 64 64" className="shrink-0">
            <rect x="10" y="18" width="44" height="30" rx="3" fill="none" stroke="#5FA8A0" strokeWidth="2.5" />
            <path d="M10 20 L32 38 L54 20" fill="none" stroke="#E8735F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="font-display text-2xl text-chalk leading-none">Candid</p>
            <p className="font-mono text-[11px] text-chalk/45 mt-1">
              first quarter · midnight builder challenge
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          {status === "connected" && address ? (
            <button
              onClick={onDisconnect}
              className="font-mono text-xs text-teal-light border border-teal/40 rounded px-3 py-1.5 hover:bg-teal/10 transition-colors"
            >
              {walletName ?? "wallet"} · {truncate(address)}
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={status === "connecting"}
              className="font-mono text-xs text-chalk border border-chalk/25 rounded px-3 py-1.5 hover:border-coral hover:text-coral-light transition-colors disabled:opacity-50"
            >
              {status === "connecting" ? "connecting…" : "connect wallet"}
            </button>
          )}
          {status === "unavailable" && (
            <p className="text-[11px] text-chalk/40 max-w-[240px] text-right">{error}</p>
          )}
          {status === "error" && error && (
            <p className="text-[11px] text-coral-light max-w-[240px] text-right">{error}</p>
          )}
        </div>
      </div>
    </header>
  );
}
