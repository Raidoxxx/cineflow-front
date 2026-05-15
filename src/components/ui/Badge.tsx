import * as React from "react";
import { cn } from "../../lib/cn";

export function Badge({
  children,
  tone = "neutral",
  className,
  theme = "dark"
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "success" | "danger" | "info";
  className?: string;
  theme?: "dark" | "light";
}) {
  const toneStyles: Record<"dark" | "light", Record<string, string>> = {
    dark: {
      neutral: "border-white/10 bg-white/[0.06] text-white/80",
      gold: "border-cfGold/30 bg-cfGold/10 text-cfGold",
      success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
      danger: "border-red-400/25 bg-red-400/10 text-red-200",
      info: "border-sky-400/25 bg-sky-400/10 text-sky-200"
    },
    light: {
      neutral: "border-slate-200 bg-white text-slate-700",
      gold: "border-cfGold/20 bg-cfGold/10 text-cfGold",
      success: "border-emerald-200 bg-emerald-50 text-emerald-700",
      danger: "border-red-200 bg-red-50 text-red-700",
      info: "border-sky-200 bg-sky-50 text-sky-700"
    }
  };

  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold", toneStyles[theme][tone], className)}>
      {children}
    </span>
  );
}
