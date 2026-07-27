export type ScoreErrorCode =
  | "INVALID_POLICY"
  | "UNKNOWN_SIGNAL"
  | "DUPLICATE_OBSERVATION";

export class ScoreCalculationError extends Error {
  constructor(
    public readonly code: ScoreErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ScoreCalculationError";
  }
}
