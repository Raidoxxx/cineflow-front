import * as React from "react";
import { cn } from "../../lib/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";
type Tone = "dark" | "light";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  tone?: Tone;
}

const variantStyles: Record<Tone, Record<Variant, string>> = {
  dark: {
    primary:
      "bg-cfGold text-white shadow-glow hover:brightness-110 active:brightness-95 disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none",
    secondary: "bg-white/[0.06] text-white hover:bg-white/[0.10] border border-white/10 disabled:opacity-50",
    outline: "bg-transparent text-white border border-white/14 hover:border-cfGold/40 hover:bg-cfGold/10 disabled:opacity-50",
    ghost: "bg-transparent text-white/80 hover:bg-white/[0.06] hover:text-white disabled:opacity-50",
    danger: "bg-red-500/15 text-red-200 border border-red-500/25 hover:bg-red-500/20 disabled:opacity-50"
  },
  light: {
    primary:
      "bg-cfGold text-white shadow-[0_18px_50px_rgba(255,70,85,0.22)] hover:brightness-105 active:brightness-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none",
    secondary: "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 disabled:opacity-50",
    outline: "bg-transparent text-slate-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50",
    danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50"
  }
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-xl",
  md: "h-11 px-4 text-sm rounded-xl",
  lg: "h-12 px-5 text-base rounded-2xl"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "secondary", size = "md", fullWidth, type, tone = "dark", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition will-change-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed",
        sizeStyles[size],
        variantStyles[tone][variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
});
