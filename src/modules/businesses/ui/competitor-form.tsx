"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  removeCompetitor,
  saveCompetitor,
  type FormActionState,
} from "@/modules/businesses/application/actions";
import {
  competitorFormSchema,
  type CompetitorFormValues,
} from "@/modules/businesses/schemas/business-form";
import { BusinessFields } from "@/modules/businesses/ui/business-fields";

const emptyValues: CompetitorFormValues = {
  name: "",
  city: "",
  state: "",
  googleMaps: "",
  website: "",
  whatsapp: "",
};

type CompetitorFormProps = {
  competitorId?: string;
  defaultValues?: CompetitorFormValues;
  onCancel?: () => void;
};

export function CompetitorForm({ competitorId, defaultValues, onCancel }: CompetitorFormProps) {
  const router = useRouter();
  const [state, setState] = useState<FormActionState>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompetitorFormValues>({
    resolver: zodResolver(competitorFormSchema),
    defaultValues: defaultValues ?? emptyValues,
  });

  async function onSubmit(values: CompetitorFormValues) {
    const result = await saveCompetitor(values, competitorId);
    setState(result);
    if (result.success) {
      if (!competitorId) reset(emptyValues);
      router.refresh();
      onCancel?.();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <BusinessFields register={register} errors={errors} channelsRequired={false} />
      {state ? (
        <p
          role="status"
          className={state.success ? "text-sm text-emerald-700 dark:text-emerald-400" : "text-sm text-destructive"}
        >
          {state.message}
        </p>
      ) : null}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : competitorId ? (
            <Save className="size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          {competitorId ? "Salvar alterações" : "Adicionar concorrente"}
        </Button>
      </div>
    </form>
  );
}

export function RemoveCompetitorButton({ competitorId }: { competitorId: string }) {
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState(false);

  async function remove() {
    if (!window.confirm("Remover este concorrente da comparação?")) return;
    setIsRemoving(true);
    await removeCompetitor(competitorId);
    router.refresh();
    setIsRemoving(false);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="gap-2 text-destructive hover:text-destructive"
      disabled={isRemoving}
      onClick={remove}
    >
      {isRemoving ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
      Remover
    </Button>
  );
}
