import type { ScorePolicy } from "@/modules/scoring/domain/types";

/**
 * Version 1 is deliberately compact. Weights are product policy, not AI output,
 * and must be changed through a new version rather than mutating past analyses.
 */
export const VERIO_SCORE_V1 = {
  version: "verio-score-v1",
  minimumCoverage: 60,
  categoryWeights: {
    DISCOVERY: 25,
    TRUST: 35,
    CLARITY: 20,
    CONTACT: 20,
  },
  outcomeValues: {
    POSITIVE: 100,
    PARTIAL: 50,
    NEGATIVE: 0,
  },
  signals: [
    {
      key: "google-profile-found",
      category: "DISCOVERY",
      weight: 3,
      label: "Perfil da empresa encontrado no Google",
    },
    {
      key: "business-identity-consistent",
      category: "DISCOVERY",
      weight: 2,
      label: "Nome e localização consistentes entre canais",
    },
    {
      key: "public-reputation-visible",
      category: "TRUST",
      weight: 3,
      label: "Prova social pública e verificável",
    },
    {
      key: "business-information-complete",
      category: "TRUST",
      weight: 2,
      label: "Informações comerciais essenciais completas",
    },
    {
      key: "website-secure",
      category: "TRUST",
      weight: 2,
      label: "Site servido de forma segura",
    },
    {
      key: "services-clear",
      category: "CLARITY",
      weight: 2,
      label: "Serviços apresentados com clareza",
    },
    {
      key: "business-description-clear",
      category: "CLARITY",
      weight: 1,
      label: "Descrição do negócio compreensível",
    },
    {
      key: "whatsapp-reachable",
      category: "CONTACT",
      weight: 3,
      label: "Canal de WhatsApp acessível",
    },
    {
      key: "contact-consistent",
      category: "CONTACT",
      weight: 3,
      label: "Contato consistente entre canais",
    },
    {
      key: "contact-action-clear",
      category: "CONTACT",
      weight: 1,
      label: "Próxima ação de contato evidente",
    },
  ],
} as const satisfies ScorePolicy;
