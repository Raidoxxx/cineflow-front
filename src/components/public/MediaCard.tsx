import { useEffect, useMemo, useState } from "react";
import { Eye, Play, ShoppingCart } from "lucide-react";
import { MediaAssetModel } from "../../types";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { ExpirationBadge } from "../ui/ExpirationBadge";
import { resolveAlternatePublicFileUrl, resolvePublicFileUrl } from "../../services/api";

function mediaThumbPath(media: MediaAssetModel) {
  const isVideo = media.type === "VIDEO" || media.mimeType?.startsWith("video/");
  if (!isVideo && media.status === "READY" && media.watermarkedPath) return media.watermarkedPath;
  return media.thumbnailPath;
}

function mediaThumbUrl(media: MediaAssetModel) {
  const p = mediaThumbPath(media);
  if (!p) return undefined;
  return resolvePublicFileUrl(p);
}

export function MediaCard({
  media,
  onAdd,
  onPreview,
  disabled
}: {
  media: MediaAssetModel;
  onAdd: (media: MediaAssetModel) => void;
  onPreview?: (media: MediaAssetModel) => void;
  disabled?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const thumb = useMemo(() => mediaThumbUrl(media), [media]);
  const thumbPath = useMemo(() => mediaThumbPath(media), [media]);
  const [src, setSrc] = useState<string | undefined>(thumb);
  const isVideo = media.type === "VIDEO";

  useEffect(() => {
    setImgError(false);
    setSrc(thumb);
  }, [thumb]);

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#141418] shadow-[0_28px_120px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-1 hover:border-white/20">
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {src && !imgError ? (
          <img
            src={src}
            alt={media.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            onError={() => {
              const alt = resolveAlternatePublicFileUrl(thumbPath);
              if (alt && alt !== src) setSrc(alt);
              else setImgError(true);
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.18),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.10),transparent_55%),linear-gradient(to_bottom,#101114,#07080A)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex gap-2">
          <Badge theme="dark" tone="neutral" className="bg-white/5 text-white/85">
            {isVideo ? "Vídeo" : "Foto"}
          </Badge>
        </div>

        {isVideo ? (
          <div className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-black/40 text-white/85 backdrop-blur">
            <Play className="h-4 w-4" />
          </div>
        ) : null}

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <ExpirationBadge theme="dark" expiresAt={media.expiresAt} />
          <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs font-semibold text-white/90 backdrop-blur">{`R$ ${Number(media.price).toFixed(2)}`}</span>
        </div>

        {onPreview ? (
          <button
            type="button"
            onClick={() => onPreview(media)}
            className={cn("absolute inset-0 grid place-items-center opacity-0 transition group-hover:opacity-100", "focus-visible:opacity-100")}
            aria-label="Pré-visualizar"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/55 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
              <Eye className="h-4 w-4 text-[#FF4655]" />
              Pré-visualizar
            </span>
          </button>
        ) : null}
      </div>

      <div className="space-y-3 p-5">
        <div className="space-y-1">
          <h4 className="line-clamp-1 text-sm font-semibold text-white">{media.title}</h4>
          <p className="text-xs text-white/55">{isVideo ? "Vídeo" : "Foto"}</p>
        </div>

        <Button
          tone="light"
          disabled={disabled}
          variant="primary"
          fullWidth
          onClick={() => onAdd(media)}
          className="justify-center rounded-2xl bg-[#FF4655] shadow-[0_18px_50px_rgba(255,70,85,0.20)]"
          aria-disabled={disabled || undefined}
        >
          <ShoppingCart className="h-4 w-4" />
          Adicionar ao carrinho
        </Button>
      </div>
    </article>
  );
}
