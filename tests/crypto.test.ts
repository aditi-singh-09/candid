import { describe, it, expect } from "vitest";
import {
  deriveRespondentLeaf,
  deriveSurveyNullifier,
  isValidRating,
  randomSecretHex,
} from "../src/lib/crypto";

describe("deriveRespondentLeaf", () => {
  it("is deterministic for the same secret", async () => {
    const a = await deriveRespondentLeaf("respondent-a-secret");
    const b = await deriveRespondentLeaf("respondent-a-secret");
    expect(a).toBe(b);
  });

  it("produces a 64-character hex digest", async () => {
    const leaf = await deriveRespondentLeaf("respondent-a-secret");
    expect(leaf).toMatch(/^[0-9a-f]{64}$/);
  });

  it("differs for different secrets", async () => {
    const a = await deriveRespondentLeaf("respondent-a-secret");
    const b = await deriveRespondentLeaf("respondent-b-secret");
    expect(a).not.toBe(b);
  });
});

describe("deriveSurveyNullifier", () => {
  it("is deterministic for the same secret and survey", async () => {
    const a = await deriveSurveyNullifier("respondent-a-secret", "Demo Day Feedback");
    const b = await deriveSurveyNullifier("respondent-a-secret", "Demo Day Feedback");
    expect(a).toBe(b);
  });

  it("differs between surveys for the same respondent (nullifier is survey-scoped)", async () => {
    const surveyA = await deriveSurveyNullifier("respondent-a-secret", "Demo Day Feedback");
    const surveyB = await deriveSurveyNullifier("respondent-a-secret", "Workshop Feedback");
    expect(surveyA).not.toBe(surveyB);
  });

  it("differs between respondents for the same survey", async () => {
    const a = await deriveSurveyNullifier("respondent-a-secret", "Demo Day Feedback");
    const b = await deriveSurveyNullifier("respondent-b-secret", "Demo Day Feedback");
    expect(a).not.toBe(b);
  });

  it("never contains the raw secret as a substring", async () => {
    const n = await deriveSurveyNullifier("respondent-a-secret", "Demo Day Feedback");
    expect(n).not.toContain("respondent-a-secret");
  });
});

describe("isValidRating", () => {
  it("accepts integers 1 through 5", () => {
    for (let r = 1; r <= 5; r++) expect(isValidRating(r)).toBe(true);
  });

  it("rejects 0 and 6", () => {
    expect(isValidRating(0)).toBe(false);
    expect(isValidRating(6)).toBe(false);
  });

  it("rejects non-integer input", () => {
    expect(isValidRating(3.5)).toBe(false);
  });
});

describe("randomSecretHex", () => {
  it("produces distinct secrets across calls", () => {
    expect(randomSecretHex()).not.toBe(randomSecretHex());
  });

  it("produces a hex string of the expected length", () => {
    expect(randomSecretHex(16)).toMatch(/^[0-9a-f]{32}$/);
  });
});
