import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { MediaAssetModel } from "../../types";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api, resolvePublicFileUrl } from "../../services/api";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateTimeLocalValue(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function thumbUrl(media: MediaAssetModel) {
  if (!media.thumbnailPath) return "";
  return resolvePublicFileUrl(media.thumbnailPath);
}

type Draft = { title: string; price: string; expiresAt: string };

export function MediaMetaModal({
  items,
  onClose,
  onSaved,
  title
}: {
  items?: MediaAssetModel[];
  title?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const open = Boolean(items?.length);
  const safeItems = items ?? [];
  const initialDrafts = useMemo(() => {
    const map: Record<string, Draft> = {};
    for (const it of safeItems) {
      map[it.id] = {
        title: it.title ?? "",
        price: String(it.price ?? ""),
        expiresAt: toDateTimeLocalValue(it.expiresAt)
      };
    }
    return map;
  }, [items]);

  const [drafts, setDrafts] = useState<Record<string, Draft>>(initialDrafts);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDrafts(initialDrafts);
  }, [initialDrafts]);

  if (!open || !items) return null;

  async function save() {
    setSaving(true);
    try {
      await Promise.all(
        safeItems.map(async (it) => {
          const d = drafts[it.id];
          const price = d.price.trim() ? Number(d.price) : undefined;
          const expiresAt = d.expiresAt.trim() ? d.expiresAt : undefined;
          const body = {
            title: d.title.trim() || undefined,
            price: price !== undefined && Number.isFinite(price) ? price : undefined,
            expiresAt
          };
          await api.put(`/admin/media/${it.id}`, body);
        })
      );
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div
        className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0D0D10] shadow-[0_30px_140px_rgba(0,0,0,0.70)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{items.length > 1 ? "Configurar upload" : "Editar mídia"}</p>
            <h3 className="mt-1 truncate font-heading text-2xl text-white">{title ?? `${items.length} item(s)`}</h3>
          </div>
          <Button tone="light" variant="ghost" className="h-10 w-10 rounded-2xl p-0 text-white" onClick={onClose} aria-label="Fechar">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="max-h-[72vh] overflow-auto p-5">
          <div className="grid gap-3">
            {items.map((it) => {
              const d = drafts[it.id] ?? { title: "", price: "", expiresAt: "" };
              const thumb = thumbUrl(it);

              return (
                <div key={it.id} className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : null}
                  </div>

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs text-white/45">{it.id}</p>
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                      <Input
                        tone="cine"
                        label="Título"
                        value={d.title}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [it.id]: { ...d, title: e.target.value } }))}
                        placeholder="ex: IMG_0012.jpg"
                      />
                      <Input
                        tone="cine"
                        label="Preço (R$)"
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        value={d.price}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [it.id]: { ...d, price: e.target.value } }))}
                        placeholder="15.00"
                      />
                      <Input
                        tone="cine"
                        label="Validade"
                        type="datetime-local"
                        value={d.expiresAt}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [it.id]: { ...d, expiresAt: e.target.value } }))}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" className="rounded-2xl" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button variant="primary" className="rounded-2xl" onClick={save} disabled={saving}>
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
