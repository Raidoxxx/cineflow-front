import { MediaStatus } from "../../types";

const colorMap: Record<MediaStatus, string> = {
  PROCESSING: "bg-amber-500/20 text-amber-300",
  READY: "bg-emerald-500/20 text-emerald-300",
  FAILED: "bg-red-500/20 text-red-300",
  EXPIRED: "bg-zinc-500/20 text-zinc-300"
};

export function ProcessingStatusBadge({ status }: { status: MediaStatus }) {
  return <span className={`rounded-full px-2 py-1 text-xs ${colorMap[status]}`}>{status}</span>;
}
