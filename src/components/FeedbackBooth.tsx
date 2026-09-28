import { useState } from "react";
import { randomSecretHex, isValidRating } from "../lib/crypto";
import { submitFeedback, isDeployed } from "../lib/contractClient";
import { WalletApi } from "../lib/midnightWallet";

type Phase = "no-secret" | "ready" | "proving" | "error";

const STARS = [1, 2, 3, 4, 5];

export function FeedbackBooth({
  walletApi,
  walletConnected,
}: {
  walletApi: WalletApi | null;
  walletConnected: boolean;
}) {
  const [secret, setSecret] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(4);
  const [comment, setComment] = useState("");
  const [phase, setPhase] = useState<Phase>("no-secret");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleGenerateSecret() {
    setSecret(randomSecretHex());
    setPhase("ready");
  }

  async function handleSubmit() {
    if (!secret || !walletApi || !isValidRating(rating)) return;
    setPhase("proving");
    setErrorMsg(null);
    try {
      await submitFeedback({
        wallet: walletApi,
        respondentSecret: secret,
        rating,
        hasComment: comment.trim().length > 0,
      });
      // A real success path lands here with a tx hash once
      // contractClient's live wiring is completed.
    } catch (e) {
      console.error("FULL ERROR:", e);
      setErrorMsg(e instanceof Error ? e.message : "The response could not be submitted.");
      setPhase("error");
    }
  }

  return (
    <div className="dusk-glow border border-chalk/10 rounded-sm overflow-hidden">
      <div className="p-8">
        <p className="font-mono text-[11px] tracking-wide text-chalk/40">drop box · demo day feedback</p>
        <h2 className="font-display text-3xl text-chalk mt-1 mb-6">
          Say it plainly. No one will know it was you.
        </h2>

        {!walletConnected ? (
          <p className="text-sm text-chalk/60 leading-relaxed">
            Connect a Midnight wallet above to begin. Your respondent
            secret is generated on your device — it never leaves it.
          </p>
        ) : phase === "no-secret" ? (
          <div className="space-y-4">
            <p className="text-sm text-chalk/70 leading-relaxed">
              Generate a respondent secret. For this to count as a real
              eligible response, the corresponding leaf must already be
              part of the survey's eligibility root at deployment time —
              see docs/USAGE.md for wiring a real eligibility list.
            </p>
            <button
              onClick={handleGenerateSecret}
              className="w-full font-mono text-sm bg-chalk text-dusk rounded-sm py-3 hover:bg-chalk/90 transition-colors"
            >
              generate respondent secret
            </button>
          </div>
        ) : (
          <div className="space-y-5 seal-drop">
            <div className="flex gap-2">
              {STARS.map((s) => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  aria-label={`${s} star${s === 1 ? "" : "s"}`}
                  className={`flex-1 font-mono text-sm rounded-sm py-3 border transition-colors ${
                    rating === s
                      ? "border-coral text-coral-light bg-coral/10"
                      : "border-chalk/15 text-chalk/60 hover:border-chalk/30"
                  }`}
                >
                  {"★".repeat(s)}
                </button>
              ))}
            </div>

            <div>
              <label className="text-xs text-chalk/50 font-mono block mb-1.5">
                optional comment — stays on your device, never submitted on-chain
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="What should we change for next time?"
                className="w-full bg-dusk-light border border-chalk/15 rounded-sm px-3 py-2 text-sm text-chalk placeholder:text-chalk/30 focus:border-teal/50 outline-none resize-none"
              />
            </div>

            {errorMsg && (
              <p className="text-sm text-coral-light border border-coral/30 bg-coral/5 rounded-sm px-3 py-2 leading-relaxed">
                {errorMsg}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={phase === "proving" || !isDeployed()}
              className="w-full font-mono text-sm bg-teal text-dusk-deep rounded-sm py-3.5 hover:bg-teal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              title={!isDeployed() ? "No contract deployed yet — see the banner above" : undefined}
            >
              {phase === "proving" ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 rounded-full border-2 border-dusk-deep/30 border-t-dusk-deep animate-spin" />
                  generating proof…
                </>
              ) : (
                "drop it in, anonymously"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
