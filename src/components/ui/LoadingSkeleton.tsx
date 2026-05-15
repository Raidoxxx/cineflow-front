import { cn } from "../../lib/cn";

export function LoadingSkeleton({ className, theme = "dark" }: { className?: string; theme?: "dark" | "light" }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl border",
        theme === "light" ? "border-slate-200 bg-slate-100" : "border-white/10 bg-white/[0.05]",
        className
      )}
    />
  );
}

