import type { ScorePolicy } from "@/modules/scoring/domain/types";

/**
 * Version 2 combines registered-channel facts with automatically collected,
 * reproducible website foundations. External data that cannot be collected is
 * represented as NOT_VERIFIABLE and reduces coverage instead of becoming a
 * false negative.
 */
export const VERIO_SCORE_V2 = {
  version: "verio-score-v2",
  minimumCoverage: 60,
  categoryWeights: {
    DISCOVERY: 25,
    TRUST: 30,
    CLARITY: 25,
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
      key: "seo-foundation",
      category: "DISCOVERY",
      weight: 3,
      label: "Fundamentos técnicos de SEO presentes",
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
      label: "Site final servido com HTTPS",
    },
    {
      key: "website-reachable",
      category: "TRUST",
      weight: 3,
      label: "Site respondeu à auditoria técnica",
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
      key: "website-content-clarity",
      category: "CLARITY",
      weight: 3,
      label: "Conteúdo comercial identificável no site",
    },
    {
      key: "website-mobile-foundation",
      category: "CLARITY",
      weight: 2,
      label: "Fundamento de visualização móvel presente",
    },
    {
      key: "website-accessibility-foundation",
      category: "CLARITY",
      weight: 1,
      label: "Idioma da página declarado",
    },
    {
      key: "whatsapp-reachable",
      category: "CONTACT",
      weight: 3,
      label: "Canal de WhatsApp cadastrado",
    },
    {
      key: "whatsapp-number-valid",
      category: "CONTACT",
      weight: 3,
      label: "Número do WhatsApp estruturalmente válido",
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
    {
      key: "website-contact-visible",
      category: "CONTACT",
      weight: 2,
      label: "Contato encontrado no conteúdo do site",
    },
  ],
} as const satisfies ScorePolicy;
