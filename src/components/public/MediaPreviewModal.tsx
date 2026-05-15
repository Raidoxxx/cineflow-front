import { X, Image as ImageIcon } from "lucide-react";
import { MediaAssetModel } from "../../types";
import { Button } from "../ui/Button";
import { resolvePublicFileUrl } from "../../services/api";

function previewUrl(media: MediaAssetModel) {
  if (!media.watermarkedPath) return undefined;
  return resolvePublicFileUrl(media.watermarkedPath);
}

export function MediaPreviewModal({ media, onClose }: { media?: MediaAssetModel; onClose: () => void }) {
  if (!media) return null;
  const url = previewUrl(media);
  const isVideo = media.type === "VIDEO" || media.mimeType?.startsWith("video/");

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D10] shadow-[0_30px_140px_rgba(0,0,0,0.70)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Pré-visualização</p>
            <h3 className="mt-1 truncate font-heading text-2xl text-white">{media.title}</h3>
          </div>
          <Button tone="light" variant="ghost" className="h-10 w-10 rounded-2xl p-0 text-white" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.16),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(255,255,255,0.08),transparent_55%)] p-5">
          {url ? (
            isVideo ? (
              <video controls playsInline src={url} className="max-h-[72vh] w-full rounded-2xl border border-white/10 object-contain bg-black/40" />
            ) : (
              <img src={url} className="max-h-[72vh] w-full rounded-2xl border border-white/10 object-contain bg-black/40" />
            )
          ) : (
            <div className="grid min-h-[40vh] place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <div className="text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/30 text-white/70">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">Preview indisponível</p>
                <p className="mt-1 text-xs text-white/55">Esta mídia não possui uma versão com marca d’água configurada.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
