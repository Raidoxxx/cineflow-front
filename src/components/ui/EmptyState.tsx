import * as React from "react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
  tone = "dark"
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  tone?: "dark" | "light";
}) {
  const isLight = tone === "light";
  return (
    <div
      className={cn(
        "rounded-3xl border p-8 text-center shadow-soft",
        isLight ? "border-slate-200 bg-white" : "border-white/10 bg-white/[0.03] backdrop-blur",
        className
      )}
    >
      {icon ? (
        <div
          className={cn(
            "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl border",
            isLight ? "border-slate-200 bg-slate-50 text-slate-600" : "border-white/10 bg-white/[0.04] text-white/70"
          )}
        >
          {icon}
        </div>
      ) : null}
      <h3 className={cn("text-lg font-semibold", isLight ? "text-slate-900" : "text-white")}>{title}</h3>
      {description ? <p className={cn("mt-2 text-sm", isLight ? "text-slate-600" : "text-white/60")}>{description}</p> : null}
      {actionLabel && onAction ? (
        <div className="mt-5 flex justify-center">
          <Button tone={tone} variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
