import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  hint?: string;
  error?: string;
  tone?: "dark" | "light" | "cine";
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, hint, error, id, children, tone = "dark", ...props },
  ref
) {
  const selectId = id ?? React.useId();
  const describedBy = error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined;
  const isLight = tone === "light";
  const isCine = tone === "cine";

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={selectId}
          className={isLight ? "text-sm font-semibold text-slate-900" : isCine ? "text-sm font-semibold text-white" : "text-sm font-semibold text-white/90"}
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 w-full appearance-none rounded-2xl border px-3 pr-10 text-sm shadow-soft backdrop-blur",
            isLight
              ? "border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-cfGold/50"
              : isCine
                ? "border-white/10 bg-white/[0.04] text-white hover:border-white/20 focus:border-cfGold/40"
                : "border-white/10 bg-white/[0.04] text-white hover:border-white/16 focus:border-cfGold/25",
            error && "border-red-500/40",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className={cn(
            "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2",
            isLight ? "text-slate-400" : isCine ? "text-white/60" : "text-white/60"
          )}
        />
      </div>
      {error ? (
        <p id={`${selectId}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${selectId}-hint`} className={isLight ? "text-xs text-slate-500" : isCine ? "text-xs text-white/60" : "text-xs text-white/55"}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
