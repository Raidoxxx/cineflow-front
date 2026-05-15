import { useMemo, useState } from "react";
import { ExternalLink, Eye, Image as ImageIcon, Pencil, Play, Trash2 } from "lucide-react";
import { MediaAssetModel } from "../../types";
import { api, resolvePublicFileUrl } from "../../services/api";
import { ExpirationBadge } from "../ui/ExpirationBadge";
import { Button } from "../ui/Button";
import { MediaMetaModal } from "./MediaMetaModal";
import { MediaPreviewModal } from "./MediaPreviewModal";
import { ProcessingStatusBadge } from "./ProcessingStatusBadge";

function cardPreviewUrl(item: MediaAssetModel) {
  const isVideo = item.type === "VIDEO" || item.mimeType?.startsWith("video/");
  if (isVideo) return item.thumbnailPath ? resolvePublicFileUrl(item.thumbnailPath) : "";
  if (item.status === "READY" && item.watermarkedPath) return resolvePublicFileUrl(item.watermarkedPath);
  if (item.thumbnailPath) return resolvePublicFileUrl(item.thumbnailPath);
  return "";
}

function openUrl(item: MediaAssetModel) {
  if (item.watermarkedPath) return resolvePublicFileUrl(item.watermarkedPath);
  if (item.thumbnailPath) return resolvePublicFileUrl(item.thumbnailPath);
  return "";
}

export function MediaTable({ media, onRefresh }: { media: MediaAssetModel[]; onRefresh?: () => void }) {
  const [preview, setPreview] = useState<MediaAssetModel>();
  const [editing, setEditing] = useState<MediaAssetModel[]>();
  const sorted = useMemo(() => [...media].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [media]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((item) => {
          const previewUrl = cardPreviewUrl(item);
          const href = openUrl(item);
          const isVideo = item.type === "VIDEO" || item.mimeType?.startsWith("video/");

          return (
            <article
              key={item.id}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-[#141418] shadow-[0_28px_120px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-1 hover:border-white/20"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                {previewUrl ? (
                  <img src={previewUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.16),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.10),transparent_55%),linear-gradient(to_bottom,#101114,#07080A)]" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                <div className="absolute left-3 top-3 flex items-center gap-2">
                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-semibold text-white/85 backdrop-blur">
                    {isVideo ? "Vídeo" : "Foto"}
                  </span>
                  <ProcessingStatusBadge status={item.status} />
                </div>

                {isVideo ? (
                  <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-black/40 text-white/85 backdrop-blur">
                    <Play className="h-4 w-4" />
                  </div>
                ) : null}

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <ExpirationBadge theme="dark" expiresAt={item.expiresAt} />
                  <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur">{`R$ ${Number(item.price).toFixed(2)}`}</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => setPreview(item)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                    aria-label="Pré-visualizar"
                  >
                    <Eye className="h-4 w-4 text-[#FF4655]" />
                    Preview
                  </button>

                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur"
                      aria-label="Abrir arquivo"
                    >
                      <ExternalLink className="h-4 w-4 text-white/80" />
                      Abrir
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2 p-4">
                <div className="min-w-0">
                  <h4 className="line-clamp-1 text-sm font-semibold text-white">{item.title}</h4>
                  <p className="mt-1 truncate font-mono text-[11px] text-white/45">{item.id}</p>
                </div>

                {!previewUrl ? (
                  <div className="flex items-center gap-2 text-xs text-white/55">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Sem preview ainda
                  </div>
                ) : null}

                {item.status === "PROCESSING" ? (
                  <div className="pt-1">
                    <div className="h-2 w-full overflow-hidden rounded-full border border-white/10 bg-black/30">
                      <div
                        className="h-full rounded-full bg-[#FF4655] transition-[width] duration-300"
                        style={{ width: `${Math.max(2, Math.min(100, Number(item.processingProgress ?? 8)))}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-white/55">{item.processingProgress ? `${Math.round(item.processingProgress)}%` : "Processando…"}</p>
                  </div>
                ) : null}

                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 flex-1 rounded-2xl"
                    onClick={() => setEditing([item])}
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    className="h-9 flex-1 rounded-2xl"
                    onClick={async () => {
                      const ok = window.confirm(`Excluir "${item.title}"?`);
                      if (!ok) return;
                      await api.delete(`/admin/media/${item.id}`);
                      await onRefresh?.();
                    }}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <MediaPreviewModal media={preview} onClose={() => setPreview(undefined)} />
      <MediaMetaModal items={editing} title="Editar mídia" onClose={() => setEditing(undefined)} onSaved={() => onRefresh?.()} />
    </>
  );
}
