import type { AIAnalysis, AIAnalyzer, AIProvider } from "@/modules/ai-analyzer";
import { AIAnalyzerError, StructuredAIAnalyzer } from "@/modules/ai-analyzer";
import {
  credibilityAnalysisDraftSchema,
  credibilityAnalysisInputSchema,
  type CredibilityAnalysisDraft,
  type CredibilityAnalysisInput,
} from "@/modules/analyses/ai/credibility-analysis";
import { CredibilityPromptBuilder } from "@/modules/analyses/ai/credibility-prompt-builder";

export class CredibilityAIAnalyzer
  implements AIAnalyzer<CredibilityAnalysisInput, CredibilityAnalysisDraft>
{
  private readonly analyzer: StructuredAIAnalyzer<
    CredibilityAnalysisInput,
    CredibilityAnalysisDraft
  >;

  constructor(provider: AIProvider) {
    this.analyzer = new StructuredAIAnalyzer({
      provider,
      promptBuilder: new CredibilityPromptBuilder(),
      outputSchema: credibilityAnalysisDraftSchema,
      schemaName: "credibility_analysis_draft",
    });
  }

  async analyze(
    input: CredibilityAnalysisInput,
    signal?: AbortSignal,
  ): Promise<AIAnalysis<CredibilityAnalysisDraft>> {
    const parsed = credibilityAnalysisInputSchema.safeParse(input);
    if (!parsed.success) {
      throw new AIAnalyzerError("INVALID_INPUT", "The analysis input is invalid.", {
        cause: parsed.error,
      });
    }
    const analysis = await this.analyzer.analyze(parsed.data, signal);
    const allowedEvidence = new Set(parsed.data.evidence.map(({ key }) => key));
    const references = [
      ...analysis.data.observations.flatMap(({ evidenceKeys }) => evidenceKeys),
      ...analysis.data.recommendationDrafts.flatMap(({ evidenceKeys }) => evidenceKeys),
    ];
    if (references.some((key) => !allowedEvidence.has(key))) {
      throw new AIAnalyzerError(
        "PROVIDER_OUTPUT_UNKNOWN_EVIDENCE",
        "The analysis references evidence that was not provided.",
      );
    }
    return analysis;
  }
}
