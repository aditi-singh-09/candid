import { Header } from "./components/Header";
import { DeploymentBanner } from "./components/DeploymentBanner";
import { FeedbackBooth } from "./components/FeedbackBooth";
import { ResultsLedger } from "./components/ResultsLedger";
import { PrivacyLedger } from "./components/PrivacyLedger";
import { useMidnightWallet } from "./hooks/useMidnightWallet";
import { getDeployment } from "./lib/contractClient";

function App() {
  const wallet = useMidnightWallet();
  const deployment = getDeployment();

  return (
    <div className="min-h-screen bg-dusk flex flex-col">
      <Header
        status={wallet.status}
        address={wallet.address}
        walletName={wallet.walletName}
        error={wallet.error}
        onConnect={wallet.connect}
        onDisconnect={wallet.disconnect}
      />

      <main className="flex-1 mx-auto max-w-3xl w-full px-6 py-12">
        <section className="mb-8">
          <p className="font-mono text-[11px] text-chalk/40 mb-3">
            🌓 first quarter — half light, half shadow
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-chalk leading-tight max-w-xl">
            Verifiably heard. Never identified.
          </h1>
          <p className="text-chalk/60 mt-3 max-w-lg leading-relaxed">
            Candid proves a response came from an eligible participant
            and counts it toward the public tally — without ever
            recording who gave it, or what they wrote. Every response
            is a real transaction, never simulated locally.
          </p>
        </section>

        <DeploymentBanner deployment={deployment} />

        <section className="mb-10">
          <FeedbackBooth walletApi={wallet.walletApi} walletConnected={wallet.status === "connected"} />
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <ResultsLedger />
          <PrivacyLedger />
        </section>
      </main>

      <footer className="border-t border-chalk/10">
        <div className="mx-auto max-w-3xl px-6 py-6 flex flex-col sm:flex-row justify-between gap-2">
          <p className="font-mono text-[11px] text-chalk/35">
            built on midnight · compact contracts
          </p>
          <p className="font-mono text-[11px] text-chalk/35">
            level 3 · first quarter submission
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
