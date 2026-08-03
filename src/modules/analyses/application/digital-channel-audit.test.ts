import assert from "node:assert/strict";
import test from "node:test";

import {
  assessWebsiteHtml,
  auditDigitalChannels,
} from "./digital-channel-audit";

test("extracts deterministic website foundations", () => {
  const result = assessWebsiteHtml(`<!doctype html>
    <html lang="pt-BR"><head>
      <title>Empresa local</title>
      <meta name="description" content="Serviços para sua empresa">
      <meta name="viewport" content="width=device-width">
      <link rel="canonical" href="https://example.com">
    </head><body><h1>Nossos serviços</h1><a href="https://wa.me/5511999999999">Contato</a></body></html>`);

  assert.equal(
    result.observations.find(({ signalKey }) => signalKey === "seo-foundation")
      ?.outcome,
    "POSITIVE",
  );
  assert.equal(
    result.observations.find(
      ({ signalKey }) => signalKey === "website-contact-visible",
    )?.outcome,
    "POSITIVE",
  );
});

test("does not fetch a website that resolves to a private address", async () => {
  let fetched = false;
  const result = await auditDigitalChannels(
    [{ type: "WEBSITE", value: "https://example.com", status: "CONFIRMED" }],
    {
      fetch: async () => {
        fetched = true;
        return new Response();
      },
      resolve: async () => ["127.0.0.1"],
    },
  );

  assert.equal(fetched, false);
  assert.equal(result.metadata.websiteFailureCode, "PRIVATE_ADDRESS");
  assert.equal(
    result.observations.every(({ outcome }) => outcome === "NOT_VERIFIABLE"),
    true,
  );
});

test("validates every redirect target before following it", async () => {
  let requests = 0;
  const result = await auditDigitalChannels(
    [{ type: "WEBSITE", value: "https://public.example", status: "CONFIRMED" }],
    {
      fetch: async () => {
        requests += 1;
        return new Response(null, {
          status: 302,
          headers: { location: "http://internal.example/private" },
        });
      },
      resolve: async (hostname) =>
        hostname === "public.example" ? ["203.0.114.10"] : ["10.0.0.1"],
    },
  );

  assert.equal(requests, 1);
  assert.equal(result.metadata.websiteFailureCode, "PRIVATE_ADDRESS");
});

test("validates the international number embedded in a WhatsApp URL", async () => {
  const result = await auditDigitalChannels([
    {
      type: "WHATSAPP",
      value: "https://wa.me/5511999999999",
      status: "CONFIRMED",
    },
  ]);

  assert.equal(result.metadata.whatsappNumberFound, true);
  assert.equal(
    result.observations.find(
      ({ signalKey }) => signalKey === "whatsapp-number-valid",
    )?.outcome,
    "POSITIVE",
  );
});
