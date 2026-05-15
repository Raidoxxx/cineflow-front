import * as React from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  tone?: "dark" | "light" | "cine";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, hint, error, startAdornment, endAdornment, id, tone = "dark", ...props },
  ref
) {
  const inputId = id ?? React.useId();
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  const isLight = tone === "light";
  const isCine = tone === "cine";

  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className={isLight ? "text-sm font-semibold text-slate-900" : isCine ? "text-sm font-semibold text-white" : "text-sm font-semibold text-white/90"}
        >
          {label}
        </label>
      ) : null}
      <div
        className={cn(
          "flex items-center gap-2 rounded-2xl border px-3 shadow-soft backdrop-blur",
          isLight
            ? "border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus-within:border-cfGold/50"
            : isCine
              ? "border-white/10 bg-white/[0.04] text-white hover:border-white/20 focus-within:border-cfGold/40"
              : "bg-white/[0.04] text-white",
          error
            ? "border-red-500/40"
            : isLight
              ? "hover:border-slate-300 focus-within:border-cfGold/50"
              : isCine
                ? "hover:border-white/20 focus-within:border-cfGold/40"
              : "border-white/10 hover:border-white/16 focus-within:border-cfGold/25",
          className
        )}
      >
        {startAdornment ? <div className={isLight ? "text-slate-500" : isCine ? "text-white/70" : "text-white/60"}>{startAdornment}</div> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(
            "h-11 w-full bg-transparent text-sm placeholder:opacity-80",
            isLight ? "text-slate-900 placeholder:text-slate-400" : isCine ? "text-white placeholder:text-white/40" : "text-white placeholder:text-white/40"
          )}
          {...props}
        />
        {endAdornment ? <div className={isLight ? "text-slate-500" : isCine ? "text-white/70" : "text-white/60"}>{endAdornment}</div> : null}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className={isLight ? "text-xs text-slate-500" : isCine ? "text-xs text-white/60" : "text-xs text-white/55"}>
          {hint}
        </p>
      ) : null}
    </div>
  );
});
