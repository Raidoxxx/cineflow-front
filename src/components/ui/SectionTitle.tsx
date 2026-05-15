import * as React from "react";
import { cn } from "../../lib/cn";

export function SectionTitle({
  eyebrow,
  title,
  description,
  className,
  actions,
  tone = "dark"
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  actions?: React.ReactNode;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        {eyebrow ? (
          <p
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.22em]",
                isLight ? "text-cfGold" : "text-cfGold/90"
              )}
            >
              {eyebrow}
            </p>
        ) : null}
        <h2 className={cn("mt-2 font-heading text-3xl md:text-4xl", isLight ? "text-slate-900" : "text-white")}>{title}</h2>
        {description ? (
          <p className={cn("mt-2 max-w-2xl text-sm", isLight ? "text-slate-600" : "text-white/60")}>{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
