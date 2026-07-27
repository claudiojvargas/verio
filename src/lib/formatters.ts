const dateFormatters = {
  short: new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }),
  medium: new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }),
  long: new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }),
} as const;

export function formatDate(date: Date, style: keyof typeof dateFormatters = "medium") {
  return dateFormatters[style].format(date);
}

const analysisStatusLabels: Record<string, string> = {
  COMPLETED: "Concluída",
  PARTIAL: "Parcial",
  PROCESSING: "Processando",
  PENDING: "Pendente",
  FAILED: "Falhou",
};

export function formatAnalysisStatus(status: string) {
  return analysisStatusLabels[status] ?? status;
}
