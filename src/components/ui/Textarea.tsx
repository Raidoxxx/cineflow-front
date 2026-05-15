import * as React from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, label, hint, error, id, ...props },
  ref
) {
  const textareaId = id ?? React.useId();
  const describedBy = error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined;

  return (
    <div className="space-y-1.5">
      {label ? (
        <label htmlFor={textareaId} className="text-sm font-semibold text-white/90">
          {label}
        </label>
      ) : null}
      <textarea
        ref={ref}
        id={textareaId}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy}
        className={cn(
          "min-h-28 w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm text-white shadow-soft backdrop-blur placeholder:text-white/40 hover:border-white/16 focus:border-cfGold/25",
          error && "border-red-500/40",
          className
        )}
        {...props}
      />
      {error ? (
        <p id={`${textareaId}-error`} className="text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${textareaId}-hint`} className="text-xs text-white/55">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
