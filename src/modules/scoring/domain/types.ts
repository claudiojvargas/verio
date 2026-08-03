export const SCORE_CATEGORIES = [
  "DISCOVERY",
  "TRUST",
  "CLARITY",
  "CONTACT",
] as const;

export type ScoreCategory = (typeof SCORE_CATEGORIES)[number];

export const SIGNAL_OUTCOMES = [
  "POSITIVE",
  "PARTIAL",
  "NEGATIVE",
  "NOT_VERIFIABLE",
] as const;

export type SignalOutcome = (typeof SIGNAL_OUTCOMES)[number];

export type ScoreSignalDefinition = Readonly<{
  key: string;
  category: ScoreCategory;
  weight: number;
  label: string;
}>;

export type ScorePolicy = Readonly<{
  version: string;
  minimumCoverage: number;
  categoryWeights: Readonly<Record<ScoreCategory, number>>;
  outcomeValues: Readonly<Record<Exclude<SignalOutcome, "NOT_VERIFIABLE">, number>>;
  signals: readonly ScoreSignalDefinition[];
}>;

export type ScoreObservation = Readonly<{
  signalKey: string;
  outcome: SignalOutcome;
}>;

export type CategoryScore = Readonly<{
  category: ScoreCategory;
  score: number | null;
  coverage: number;
  weight: number;
  verifiedSignals: number;
  totalSignals: number;
}>;

export type VerioScoreResult = Readonly<{
  status: "SCORED" | "INSUFFICIENT_COVERAGE";
  totalScore: number | null;
  coverage: number;
  methodologyVersion: string;
  categories: readonly CategoryScore[];
}>;
