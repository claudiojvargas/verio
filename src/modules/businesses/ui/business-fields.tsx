import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BusinessFormValues } from "@/modules/businesses/schemas/business-form";

type BusinessFieldsProps = {
  register: UseFormRegister<BusinessFormValues>;
  errors: FieldErrors<BusinessFormValues>;
  channelsRequired?: boolean;
};

export function BusinessFields({
  register,
  errors,
  channelsRequired = true,
}: BusinessFieldsProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Nome da empresa" error={errors.name?.message} className="sm:col-span-2">
        <Input placeholder="Ex.: Estúdio Aurora" autoComplete="organization" {...register("name")} />
      </Field>
      <Field label="Cidade" error={errors.city?.message}>
        <Input placeholder="Ex.: São Paulo" autoComplete="address-level2" {...register("city")} />
      </Field>
      <Field label="Estado" error={errors.state?.message}>
        <Input
          placeholder="SP"
          maxLength={2}
          autoComplete="address-level1"
          className="uppercase"
          {...register("state")}
        />
      </Field>
      <Field
        label={`Google Maps${channelsRequired ? "" : " (opcional)"}`}
        hint="Abra o perfil no Maps e copie o link de compartilhamento."
        error={errors.googleMaps?.message}
        className="sm:col-span-2"
      >
        <Input
          type="url"
          placeholder="https://maps.app.goo.gl/..."
          autoComplete="url"
          {...register("googleMaps")}
        />
      </Field>
      <Field label="Site (opcional)" error={errors.website?.message} className="sm:col-span-2">
        <Input type="url" placeholder="https://suaempresa.com.br" {...register("website")} />
      </Field>
      <Field
        label={`WhatsApp${channelsRequired ? "" : " (opcional)"}`}
        hint="Utilize um link wa.me ou api.whatsapp.com."
        error={errors.whatsapp?.message}
        className="sm:col-span-2"
      >
        <Input type="url" placeholder="https://wa.me/5511999999999" {...register("whatsapp")} />
      </Field>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>
        {label}
        <span className="mt-2 block">{children}</span>
      </Label>
      {error ? (
        <p className="mt-1.5 text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
