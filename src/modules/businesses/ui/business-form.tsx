"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Archive, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { BusinessFields } from "@/modules/businesses/ui/business-fields";
import {
  archiveBusiness,
  saveBusiness,
  type FormActionState,
} from "@/modules/businesses/application/actions";
import {
  businessFormSchema,
  type BusinessFormValues,
} from "@/modules/businesses/schemas/business-form";

export function BusinessForm({ defaultValues }: { defaultValues: BusinessFormValues }) {
  const router = useRouter();
  const [state, setState] = useState<FormActionState>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessFormValues>({
    resolver: zodResolver(businessFormSchema),
    defaultValues,
  });

  async function onSubmit(values: BusinessFormValues) {
    const result = await saveBusiness(values);
    setState(result);
    if (result.success) router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7" noValidate>
      <BusinessFields register={register} errors={errors} />
      {state ? (
        <p
          role="status"
          className={state.success ? "text-sm text-emerald-700 dark:text-emerald-400" : "text-sm text-destructive"}
        >
          {state.message}
        </p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          Salvar empresa
        </Button>
      </div>
    </form>
  );
}

export function ArchiveBusinessButton() {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);

  async function archive() {
    if (!window.confirm("Arquivar a empresa e removê-la do painel ativo?")) return;
    setIsArchiving(true);
    const result = await archiveBusiness();
    if (result.success) router.push("/painel");
    setIsArchiving(false);
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="gap-2 text-destructive hover:text-destructive"
      disabled={isArchiving}
      onClick={archive}
    >
      {isArchiving ? <Loader2 className="size-4 animate-spin" /> : <Archive className="size-4" />}
      Arquivar empresa
    </Button>
  );
}
