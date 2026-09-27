// crypto.ts
//
// Pure, side-effect-free helpers for deriving the values a respondent's
// browser needs before handing a transaction to the wallet for proving:
// the eligibility leaf, and the survey-scoped nullifier. These mirror
// exactly what `contracts/survey.compact` computes via `persistentHash`.
//
// Holds no state, produces no ledger result — exists so this logic can
// be unit-tested (tests/crypto.test.ts) and reused by
// src/lib/contractClient.ts when constructing real transaction witnesses.

export async function sha256Hex(input: string): Promise<string> {
  const enc = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function randomSecretHex(bytes = 16): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** The eligibility leaf a respondent's secret hashes to — matches `persistentHash<Bytes<32>>(secret)`. */
export function deriveRespondentLeaf(secret: string): Promise<string> {
  return sha256Hex(secret);
}

/** The survey-scoped nullifier — matches the circuit's `[secret, hash(surveyTitle)]`. */
export async function deriveSurveyNullifier(secret: string, surveyTitle: string): Promise<string> {
  const titleHash = await sha256Hex(surveyTitle);
  return sha256Hex(`${secret}:${titleHash}`);
}

export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}
