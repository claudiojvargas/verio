import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ids = {
  user: "seed_user_owner",
  business: "seed_business_verio_demo",
  competitorOne: "seed_business_competitor_one",
  competitorTwo: "seed_business_competitor_two",
  analysis: "seed_analysis_completed",
  result: "seed_result_completed",
  recommendationOne: "seed_recommendation_google_profile",
  recommendationTwo: "seed_recommendation_website_contact",
} as const;

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("The demonstration seed must not run in production.");
  }

  const owner = await prisma.user.upsert({
    where: { identityProviderId: "seed|owner" },
    update: {},
    create: {
      id: ids.user,
      identityProviderId: "seed|owner",
      email: "dona@exemplo.verio.local",
      name: "Daniela Demo",
    },
  });

  const business = await prisma.business.upsert({
    where: { id: ids.business },
    update: {},
    create: {
      id: ids.business,
      name: "Estúdio Aurora",
      normalizedName: "estudio aurora",
      city: "São Paulo",
      state: "SP",
      memberships: {
        create: { userId: owner.id, role: "OWNER" },
      },
      channels: {
        create: [
          {
            type: "GOOGLE_MAPS",
            value: "https://maps.google.com/?cid=100000000000000001",
            canonicalValue: "google:100000000000000001",
            confirmedAt: new Date("2026-01-10T12:00:00.000Z"),
          },
          {
            type: "WEBSITE",
            value: "https://aurora.example",
            canonicalValue: "https://aurora.example/",
            confirmedAt: new Date("2026-01-10T12:00:00.000Z"),
          },
          {
            type: "WHATSAPP",
            value: "https://wa.me/5511999990000",
            canonicalValue: "whatsapp:5511999990000",
            confirmedAt: new Date("2026-01-10T12:00:00.000Z"),
          },
        ],
      },
    },
  });

  const [competitorOne, competitorTwo] = await Promise.all([
    prisma.business.upsert({
      where: { id: ids.competitorOne },
      update: {},
      create: {
        id: ids.competitorOne,
        name: "Espaço Horizonte",
        normalizedName: "espaco horizonte",
        city: "São Paulo",
        state: "SP",
      },
    }),
    prisma.business.upsert({
      where: { id: ids.competitorTwo },
      update: {},
      create: {
        id: ids.competitorTwo,
        name: "Clínica Jardim",
        normalizedName: "clinica jardim",
        city: "São Paulo",
        state: "SP",
      },
    }),
  ]);

  await prisma.competitor.createMany({
    data: [
      {
        id: "seed_competitor_one",
        businessId: business.id,
        competitorBusinessId: competitorOne.id,
        createdByUserId: owner.id,
        position: 1,
      },
      {
        id: "seed_competitor_two",
        businessId: business.id,
        competitorBusinessId: competitorTwo.id,
        createdByUserId: owner.id,
        position: 2,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.analysis.upsert({
    where: { id: ids.analysis },
    update: {},
    create: {
      id: ids.analysis,
      businessId: business.id,
      requestedByUserId: owner.id,
      status: "COMPLETED",
      methodologyVersion: "demo-v1",
      startedAt: new Date("2026-01-10T12:01:00.000Z"),
      completedAt: new Date("2026-01-10T12:02:00.000Z"),
      competitors: {
        create: [
          {
            primaryBusinessId: business.id,
            competitorBusinessId: competitorOne.id,
            position: 1,
            nameSnapshot: competitorOne.name,
            citySnapshot: competitorOne.city,
            stateSnapshot: competitorOne.state,
            channelsSnapshot: [],
            resultStatus: "SCORED",
            totalScore: 74,
            coveragePercentage: 100,
            dimensions: [
              { key: "discovery", score: 78, weight: 25 },
              { key: "trust", score: 76, weight: 35 },
              { key: "clarity", score: 72, weight: 20 },
              { key: "contact", score: 66, weight: 20 },
            ],
            evidence: [],
          },
          {
            primaryBusinessId: business.id,
            competitorBusinessId: competitorTwo.id,
            position: 2,
            nameSnapshot: competitorTwo.name,
            citySnapshot: competitorTwo.city,
            stateSnapshot: competitorTwo.state,
            channelsSnapshot: [],
            resultStatus: "SCORED",
            totalScore: 61,
            coveragePercentage: 100,
            dimensions: [
              { key: "discovery", score: 69, weight: 25 },
              { key: "trust", score: 58, weight: 35 },
              { key: "clarity", score: 60, weight: 20 },
              { key: "contact", score: 59, weight: 20 },
            ],
            evidence: [],
          },
        ],
      },
      job: {
        create: {
          status: "SUCCEEDED",
          attempts: 1,
        },
      },
      result: {
        create: {
          id: ids.result,
          status: "SCORED",
          totalScore: 68,
          coveragePercentage: 100,
          dimensions: [
            { key: "discovery", score: 72, weight: 25 },
            { key: "trust", score: 64, weight: 35 },
            { key: "clarity", score: 66, weight: 20 },
            { key: "contact", score: 70, weight: 20 },
          ],
          evidence: [
            {
              key: "google-hours-complete",
              outcome: "positive",
              source: "google_maps",
            },
            {
              key: "website-contact-inconsistent",
              outcome: "attention",
              source: "website",
            },
          ],
          summary: {
            strength: "O horário comercial está visível.",
            priority: "Padronize o contato apresentado no site.",
          },
        },
      },
      recommendations: {
        create: [
          {
            id: ids.recommendationOne,
            key: "complete-google-profile",
            title: "Revise as informações do perfil",
            rationale:
              "Informações completas reduzem dúvidas antes do contato.",
            evidenceKeys: ["google-hours-complete"],
            impact: "MEDIUM",
            effort: "LOW",
            confidence: 90,
            priority: 1,
            steps: ["Confirme horários", "Revise a categoria principal"],
            generatorVersion: "catalog-demo-v1",
          },
          {
            id: ids.recommendationTwo,
            key: "align-website-contact",
            title: "Padronize o contato do site",
            rationale: "O contato deve ser coerente em todos os canais.",
            evidenceKeys: ["website-contact-inconsistent"],
            impact: "HIGH",
            effort: "LOW",
            confidence: 95,
            priority: 2,
            steps: ["Confirme o número oficial", "Atualize o botão do site"],
            generatorVersion: "catalog-demo-v1",
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
