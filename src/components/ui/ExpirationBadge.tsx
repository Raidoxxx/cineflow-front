export function ExpirationBadge({ expiresAt, theme = "dark" }: { expiresAt?: string; theme?: "dark" | "light" }) {
  if (!expiresAt) return <span className={theme === "light" ? "text-xs text-slate-500" : "text-xs text-white/55"}>Sem validade</span>;

  const expired = new Date(expiresAt) < new Date();
  const cls =
    theme === "light"
      ? expired
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-emerald-200 bg-emerald-50 text-emerald-700"
      : expired
        ? "border-red-400/25 bg-red-400/10 text-red-200"
        : "border-emerald-400/25 bg-emerald-400/10 text-emerald-200";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>
      {expired ? "Expirado" : `Válido até ${new Date(expiresAt).toLocaleDateString("pt-BR")}`}
    </span>
  );
}

