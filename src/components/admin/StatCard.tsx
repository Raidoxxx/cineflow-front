import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  className
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  className?: string;
}) {
  return (
    <article className={cn("rounded-3xl border border-white/10 bg-adminCard/70 p-5 shadow-card backdrop-blur", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">{title}</p>
          <p className="mt-2 text-3xl font-black text-adminText">{value}</p>
          {hint ? <p className="mt-1 text-xs text-adminTextMuted">{hint}</p> : null}
        </div>
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-black/25 text-cfGold">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

