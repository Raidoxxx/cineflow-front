import * as React from "react";
import { cn } from "../../lib/cn";

export function DataTable({
  columns,
  children,
  className
}: {
  columns: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-soft", className)}>
      <table className="w-full text-left text-sm text-white/90">
        <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/60">
          <tr>{columns}</tr>
        </thead>
        <tbody className="divide-y divide-white/10">{children}</tbody>
      </table>
    </div>
  );
}

