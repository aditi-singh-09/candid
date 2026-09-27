import { isDeployed } from "../lib/contractClient";

const STARS = [5, 4, 3, 2, 1];

export function ResultsLedger() {
  const deployed = isDeployed();

  return (
    <div className="border border-chalk/12 rounded-sm p-6">
      <div className="flex items-baseline justify-between mb-5">
        <h3 className="font-display text-xl text-chalk">Results ledger</h3>
        <span className="font-mono text-[11px] text-chalk/40">
          {deployed ? "live · on-chain" : "awaiting deployment"}
        </span>
      </div>

      <div className="space-y-3">
        {STARS.map((s) => (
          <div key={s} className="flex justify-between items-center text-sm">
            <span className="text-chalk/70 font-mono">{"★".repeat(s)}</span>
            <span className="font-mono text-xs text-chalk/40">
              {deployed ? "reads from managed/survey" : "—"}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[11px] text-chalk/35 mt-5 pt-5 border-t border-chalk/10">
        Rating counts and comment count come from the contract's public
        ledger state — this panel does not compute or estimate them
        locally.
      </p>
    </div>
  );
}
