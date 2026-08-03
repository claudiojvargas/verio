import { ScoreCalculationError } from "@/modules/scoring/domain/errors";
import {
  SCORE_CATEGORIES,
  type CategoryScore,
  type ScoreObservation,
  type ScorePolicy,
  type VerioScoreResult,
} from "@/modules/scoring/domain/types";

/** Pure, deterministic calculation. It performs no I/O and never calls AI. */
export function calculateVerioScore(
  observations: readonly ScoreObservation[],
  policy: ScorePolicy,
): VerioScoreResult {
  validatePolicy(policy);
  const definitions = new Map(policy.signals.map((signal) => [signal.key, signal]));
  const observationMap = new Map<string, ScoreObservation>();

  for (const observation of observations) {
    if (!definitions.has(observation.signalKey)) {
      throw new ScoreCalculationError(
        "UNKNOWN_SIGNAL",
        `Signal "${observation.signalKey}" does not exist in policy ${policy.version}.`,
      );
    }
    if (observationMap.has(observation.signalKey)) {
      throw new ScoreCalculationError(
        "DUPLICATE_OBSERVATION",
        `Signal "${observation.signalKey}" was supplied more than once.`,
      );
    }
    observationMap.set(observation.signalKey, observation);
  }

  const categories = SCORE_CATEGORIES.map((category): CategoryScore => {
    const signals = policy.signals.filter((signal) => signal.category === category);
    const potentialWeight = sum(signals.map(({ weight }) => weight));
    const verified = signals.flatMap((signal) => {
      const observation = observationMap.get(signal.key);
      return observation && observation.outcome !== "NOT_VERIFIABLE"
        ? [{ signal, observation }]
        : [];
    });
    const verifiedWeight = sum(verified.map(({ signal }) => signal.weight));
    const weightedPoints = sum(
      verified.map(
        ({ signal, observation }) =>
          signal.weight *
          (observation.outcome === "NOT_VERIFIABLE"
            ? 0
            : policy.outcomeValues[observation.outcome]),
      ),
    );

    return {
      category,
      score: verifiedWeight > 0 ? roundScore(weightedPoints / verifiedWeight) : null,
      coverage: roundPercentage((verifiedWeight / potentialWeight) * 100),
      weight: policy.categoryWeights[category],
      verifiedSignals: verified.length,
      totalSignals: signals.length,
    };
  });

  const totalCategoryWeight = sum(
    SCORE_CATEGORIES.map((category) => policy.categoryWeights[category]),
  );
  const coverage = roundPercentage(
    sum(
      categories.map(
        (category) => category.weight * (category.coverage / 100),
      ),
    ) /
      totalCategoryWeight *
      100,
  );
  const availableCategories = categories.filter(
    (category): category is CategoryScore & { score: number } =>
      category.score !== null,
  );
  const availableWeight = sum(availableCategories.map(({ weight }) => weight));
  const rawTotal =
    availableWeight > 0
      ? sum(availableCategories.map(({ score, weight }) => score * weight)) /
        availableWeight
      : null;
  const hasSufficientCoverage =
    rawTotal !== null && coverage >= policy.minimumCoverage;

  return {
    status: hasSufficientCoverage ? "SCORED" : "INSUFFICIENT_COVERAGE",
    totalScore: hasSufficientCoverage ? roundScore(rawTotal) : null,
    coverage,
    methodologyVersion: policy.version,
    categories,
  };
}

function validatePolicy(policy: ScorePolicy) {
  if (
    !policy.version.trim() ||
    !Number.isFinite(policy.minimumCoverage) ||
    policy.minimumCoverage < 0 ||
    policy.minimumCoverage > 100
  ) {
    throw new ScoreCalculationError("INVALID_POLICY", "Policy metadata is invalid.");
  }

  const keys = new Set<string>();
  for (const category of SCORE_CATEGORIES) {
    const categoryWeight = policy.categoryWeights[category];
    const categorySignals = policy.signals.filter((signal) => signal.category === category);
    if (!Number.isFinite(categoryWeight) || categoryWeight <= 0 || categorySignals.length === 0) {
      throw new ScoreCalculationError(
        "INVALID_POLICY",
        `Category "${category}" must have a positive weight and at least one signal.`,
      );
    }
  }

  for (const signal of policy.signals) {
    if (!signal.key.trim() || keys.has(signal.key) || !Number.isFinite(signal.weight) || signal.weight <= 0) {
      throw new ScoreCalculationError(
        "INVALID_POLICY",
        `Signal "${signal.key}" is duplicated or invalid.`,
      );
    }
    keys.add(signal.key);
  }

  for (const value of Object.values(policy.outcomeValues)) {
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new ScoreCalculationError(
        "INVALID_POLICY",
        "Every outcome value must be between 0 and 100.",
      );
    }
  }
}

function sum(values: readonly number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function roundScore(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)));
}

function roundPercentage(value: number) {
  return Math.round(Math.min(100, Math.max(0, value)) * 100) / 100;
}
