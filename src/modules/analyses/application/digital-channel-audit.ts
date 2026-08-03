import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import type { RegistrationEvidence } from "./registration-assessment";
import type { RegisteredChannel } from "./registration-assessment";
import type { ScoreObservation, SignalOutcome } from "@/modules/scoring";

const MAX_REDIRECTS = 3;
const MAX_HTML_BYTES = 1_000_000;
const REQUEST_TIMEOUT_MS = 12_000;

type AuditDependencies = Readonly<{
  fetch: (input: URL, init: RequestInit) => Promise<Response>;
  resolve: (hostname: string) => Promise<readonly string[]>;
}>;

export type DigitalChannelAudit = Readonly<{
  evidence: readonly RegistrationEvidence[];
  observations: readonly ScoreObservation[];
  metadata: Readonly<{
    websiteAttempted: boolean;
    websiteCollected: boolean;
    websiteFailureCode?: string;
    whatsappNumberFound: boolean;
  }>;
}>;

export async function auditDigitalChannels(
  channels: readonly RegisteredChannel[],
  dependencies: AuditDependencies = defaultDependencies,
): Promise<DigitalChannelAudit> {
  const confirmed = new Map(
    channels
      .filter(({ status }) => status === "CONFIRMED")
      .map((channel) => [channel.type, channel]),
  );
  const website = confirmed.get("WEBSITE");
  const whatsapp = confirmed.get("WHATSAPP");
  const evidence: RegistrationEvidence[] = [];
  let websiteFailureCode: string | undefined;
  let websiteCollected = false;

  const websiteObservations = createUnavailableWebsiteObservations();
  if (website) {
    try {
      const page = await collectPublicHtml(website.value, dependencies);
      websiteCollected = true;
      const assessment = assessWebsiteHtml(page.html);
      websiteObservations.splice(
        0,
        websiteObservations.length,
        ...assessment.observations,
        {
          signalKey: "website-secure",
          outcome: page.finalUrl.startsWith("https://")
            ? "POSITIVE"
            : "NEGATIVE",
        },
      );
      evidence.push(
        {
          key: "website-response",
          channel: "WEBSITE",
          observation: `O site respondeu com HTTP ${page.status} em ${safeDisplayUrl(page.finalUrl)}.`,
        },
        ...assessment.evidence,
      );
    } catch (error) {
      websiteFailureCode = digitalAuditFailureCode(error);
      evidence.push({
        key: "website-collection-failed",
        channel: "WEBSITE",
        observation: `A coleta técnica do site não foi concluída (${websiteFailureCode}).`,
      });
    }
  }

  const whatsappNumber = whatsapp
    ? safelyExtractWhatsAppNumber(whatsapp.value)
    : null;
  const whatsappOutcome: SignalOutcome = whatsapp
    ? whatsappNumber
      ? "POSITIVE"
      : "NEGATIVE"
    : "NOT_VERIFIABLE";
  if (whatsappNumber) {
    evidence.push({
      key: "whatsapp-number-structure",
      channel: "WHATSAPP",
      observation:
        "O link contém um número internacional de WhatsApp estruturalmente válido.",
    });
  }

  return {
    evidence,
    observations: [
      ...websiteObservations,
      { signalKey: "whatsapp-number-valid", outcome: whatsappOutcome },
    ],
    metadata: {
      websiteAttempted: Boolean(website),
      websiteCollected,
      ...(websiteFailureCode ? { websiteFailureCode } : {}),
      whatsappNumberFound: Boolean(whatsappNumber),
    },
  };
}

export function assessWebsiteHtml(
  html: string,
): Pick<DigitalChannelAudit, "evidence" | "observations"> {
  const title = captureTagContent(html, "title");
  const description = captureMetaContent(html, "description");
  const h1 = captureTagContent(html, "h1");
  const canonical =
    /<link\b[^>]*\brel\s*=\s*["'][^"']*canonical[^"']*["'][^>]*>/i.test(html);
  const viewport = captureMetaContent(html, "viewport");
  const lang = /<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html);
  const serviceLanguage =
    /\b(servi[cç]os?|produtos?|solu[cç][oõ]es?|atendimento)\b/i.test(
      stripMarkup(html),
    );
  const contactVisible =
    /(?:wa\.me|whatsapp\.com|tel:|contato|fale conosco)/i.test(html);
  const seoChecks = [
    Boolean(title),
    Boolean(description),
    Boolean(h1),
    canonical,
  ];
  const seoOutcome = ratioOutcome(seoChecks);
  const clarityOutcome = ratioOutcome([serviceLanguage, Boolean(h1)]);
  const accessibilityOutcome = lang ? "POSITIVE" : "NEGATIVE";

  return {
    evidence: [
      {
        key: "website-technical-foundation",
        channel: "WEBSITE",
        observation: `Fundamentos encontrados: title=${Boolean(title)}, description=${Boolean(description)}, h1=${Boolean(h1)}, canonical=${canonical}.`,
      },
      {
        key: "website-mobile-foundation",
        channel: "WEBSITE",
        observation: `Declaração de viewport móvel: ${Boolean(viewport)}.`,
      },
      {
        key: "website-contact-content",
        channel: "WEBSITE",
        observation: `Ação ou informação de contato encontrada no HTML: ${contactVisible}.`,
      },
    ],
    observations: [
      { signalKey: "website-reachable", outcome: "POSITIVE" },
      { signalKey: "seo-foundation", outcome: seoOutcome },
      {
        signalKey: "website-mobile-foundation",
        outcome: viewport ? "POSITIVE" : "NEGATIVE",
      },
      {
        signalKey: "website-accessibility-foundation",
        outcome: accessibilityOutcome,
      },
      { signalKey: "website-content-clarity", outcome: clarityOutcome },
      {
        signalKey: "website-contact-visible",
        outcome: contactVisible ? "POSITIVE" : "NEGATIVE",
      },
    ],
  };
}

function createUnavailableWebsiteObservations(): ScoreObservation[] {
  return [
    "website-reachable",
    "website-secure",
    "seo-foundation",
    "website-mobile-foundation",
    "website-accessibility-foundation",
    "website-content-clarity",
    "website-contact-visible",
  ].map((signalKey) => ({ signalKey, outcome: "NOT_VERIFIABLE" }));
}

async function collectPublicHtml(
  initialUrl: string,
  dependencies: AuditDependencies,
) {
  let current = new URL(initialUrl);
  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await assertPublicHttpUrl(current, dependencies.resolve);
    const response = await dependencies.fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "VerioAuditBot/1.0",
      },
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirect === MAX_REDIRECTS)
        throw new Error("REDIRECT_LIMIT");
      current = new URL(location, current);
      continue;
    }
    if (!response.ok) throw new Error(`HTTP_${response.status}`);
    const contentType =
      response.headers.get("content-type")?.toLowerCase() ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new Error("UNSUPPORTED_CONTENT_TYPE");
    }
    const declaredLength = Number(
      response.headers.get("content-length") ?? "0",
    );
    if (declaredLength > MAX_HTML_BYTES) throw new Error("RESPONSE_TOO_LARGE");
    const html = await readLimitedBody(response, MAX_HTML_BYTES);
    return { finalUrl: current.toString(), status: response.status, html };
  }
  throw new Error("REDIRECT_LIMIT");
}

async function readLimitedBody(response: Response, limit: number) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel();
      throw new Error("RESPONSE_TOO_LARGE");
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

async function assertPublicHttpUrl(
  url: URL,
  resolve: AuditDependencies["resolve"],
) {
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new Error("UNSAFE_URL");
  }
  if (url.port && !["80", "443"].includes(url.port))
    throw new Error("UNSAFE_PORT");
  const addresses = isIP(url.hostname)
    ? [url.hostname]
    : await resolve(url.hostname);
  if (addresses.length === 0 || addresses.some(isPrivateAddress))
    throw new Error("PRIVATE_ADDRESS");
}

function isPrivateAddress(address: string) {
  const normalized = address.toLowerCase().replace(/^::ffff:/, "");
  if (normalized.includes(":")) {
    return (
      normalized === "::" ||
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb") ||
      normalized.startsWith("ff") ||
      normalized.startsWith("2001:db8")
    );
  }
  const [first = 0, second = 0, third = 0] = normalized.split(".").map(Number);
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168) ||
    (first === 192 && second === 0 && (third === 0 || third === 2)) ||
    (first === 198 && (second === 18 || second === 19)) ||
    (first === 198 && second === 51 && third === 100) ||
    (first === 203 && second === 0 && third === 113) ||
    first >= 224
  );
}

function extractWhatsAppNumber(value: string) {
  const url = new URL(value);
  const candidate =
    url.hostname === "wa.me"
      ? url.pathname
      : (url.searchParams.get("phone") ?? url.pathname);
  const digits = candidate.replace(/\D/g, "");
  return /^\d{10,15}$/.test(digits) ? digits : null;
}

function safelyExtractWhatsAppNumber(value: string) {
  try {
    return extractWhatsAppNumber(value);
  } catch {
    return null;
  }
}

function safeDisplayUrl(value: string) {
  const url = new URL(value);
  return `${url.origin}${url.pathname}`;
}

function captureTagContent(html: string, tag: string) {
  return (
    html
      .match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]
      ?.trim() ?? ""
  );
}

function captureMetaContent(html: string, name: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) =>
    new RegExp(`\\bname\\s*=\\s*["']${name}["']`, "i").test(candidate),
  );
  return tag?.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1]?.trim() ?? "";
}

function stripMarkup(html: string) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function ratioOutcome(checks: readonly boolean[]): SignalOutcome {
  const ratio = checks.filter(Boolean).length / checks.length;
  return ratio >= 0.75 ? "POSITIVE" : ratio >= 0.5 ? "PARTIAL" : "NEGATIVE";
}

function digitalAuditFailureCode(error: unknown) {
  if (error instanceof DOMException && error.name === "TimeoutError")
    return "TIMEOUT";
  if (error instanceof Error && /^[A-Z0-9_]+$/.test(error.message))
    return error.message;
  return "COLLECTION_FAILED";
}

const defaultDependencies: AuditDependencies = {
  fetch: (input, init) => fetch(input, init),
  resolve: async (hostname) =>
    (await lookup(hostname, { all: true })).map(({ address }) => address),
};
