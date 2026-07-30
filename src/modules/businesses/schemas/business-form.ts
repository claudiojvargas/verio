import { z } from "zod";

const optionalWebUrl = z.union([
  z.literal(""),
  safeWebUrl("Informe uma URL completa, começando com https://."),
]);

function safeWebUrl(message: string) {
  return z
    .string()
    .trim()
    .url(message)
    .refine((value) => {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password;
    }, "Utilize uma URL http ou https sem credenciais.");
}

const googleMapsUrl = z
  .string()
  .trim()
  .pipe(safeWebUrl("Informe o link completo do Google Maps."))
  .refine((value) => {
    const hostname = new URL(value).hostname.toLowerCase();
    return (
      hostname === "maps.app.goo.gl" ||
      hostname === "goo.gl" ||
      hostname.startsWith("maps.google.") ||
      hostname.startsWith("www.google.")
    );
  }, "Utilize um link válido do Google Maps.");

const whatsappUrl = z
  .string()
  .trim()
  .pipe(safeWebUrl("Informe o link completo do WhatsApp."))
  .refine((value) => {
    const hostname = new URL(value).hostname.toLowerCase();
    return hostname === "wa.me" || hostname.endsWith("whatsapp.com");
  }, "Utilize um link wa.me ou whatsapp.com.");

const locationFields = {
  name: z.string().trim().min(2, "Informe ao menos 2 caracteres.").max(160),
  city: z.string().trim().min(2, "Informe a cidade.").max(120),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^$|^[A-Z]{2}$/, "Utilize a sigla do estado com 2 letras."),
};

export const businessFormSchema = z.object({
  ...locationFields,
  googleMaps: googleMapsUrl,
  website: optionalWebUrl,
  whatsapp: whatsappUrl,
});

export const competitorFormSchema = z.object({
  ...locationFields,
  googleMaps: z.union([z.literal(""), googleMapsUrl]),
  website: optionalWebUrl,
  whatsapp: z.union([z.literal(""), whatsappUrl]),
});

export type BusinessFormValues = z.infer<typeof businessFormSchema>;
export type CompetitorFormValues = z.infer<typeof competitorFormSchema>;
