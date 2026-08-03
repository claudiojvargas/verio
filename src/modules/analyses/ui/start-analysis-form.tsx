"use client";

import { useActionState } from "react";
import { LoaderCircle, Play } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  startAnalysis,
  type StartAnalysisState,
} from "@/modules/analyses/application/actions";

const initialState: StartAnalysisState = {};

export function StartAnalysisForm() {
  const [state, action] = useActionState(startAnalysis, initialState);
  return (
    <form action={action} className="space-y-3">
      {state.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending ? (
        <LoaderCircle className="size-4 animate-spin" />
      ) : (
        <Play className="size-4" />
      )}
      {pending ? "Analisando..." : "Iniciar análise"}
    </Button>
  );
}
