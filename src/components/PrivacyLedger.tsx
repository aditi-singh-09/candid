export function PrivacyLedger() {
  return (
    <div className="border border-chalk/12 rounded-sm p-6">
      <h3 className="font-display text-xl text-chalk mb-4">
        What an observer can see
      </h3>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <p className="font-mono text-[11px] text-teal-light mb-2">public</p>
          <ul className="space-y-1.5 text-sm text-chalk/75">
            <li>· the survey title</li>
            <li>· the aggregate 1-5 star distribution</li>
            <li>· how many responses included a comment</li>
            <li>· the set of spent respondent nullifiers</li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] text-coral-light mb-2">private</p>
          <ul className="space-y-1.5 text-sm text-chalk/75">
            <li>· the respondent's eligibility secret</li>
            <li>· which respondent gave which rating</li>
            <li>· the full text of every comment</li>
            <li>· any wallet-to-response linkage</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 pt-5 border-t border-chalk/10">
        <p className="text-sm text-chalk/60 leading-relaxed">
          Each response proves, in zero-knowledge, that the caller is an
          eligible respondent and hasn't answered this survey before —{" "}
          <em className="not-italic text-chalk/80">
            without revealing who they are, or what they wrote
          </em>
          .
        </p>
      </div>
    </div>
  );
}
