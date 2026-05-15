import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Image as ImageIcon, Save } from "lucide-react";
import { RefreshCw } from "lucide-react";
import { api, resolvePublicFileUrl } from "../../services/api";
import { UploadDropzone } from "../../components/admin/UploadDropzone";
import { MediaTable } from "../../components/admin/MediaTable";
import { MediaMetaModal } from "../../components/admin/MediaMetaModal";
import { MediaAssetModel, EventModel } from "../../types";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/EmptyState";

export function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventModel | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [media, setMedia] = useState<MediaAssetModel[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [savingCover, setSavingCover] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [configureMedia, setConfigureMedia] = useState<MediaAssetModel[]>();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const coverPreview = useMemo(() => {
    const url = coverUrl.trim();
    const raw = url.length ? url : event?.coverUrl?.trim() ?? "";
    return resolvePublicFileUrl(raw);
  }, [coverUrl, event?.coverUrl]);

  async function loadEvent() {
    if (!id) return;
    const { data } = await api.get(`/admin/events/${id}`);
    setEvent(data);
    setCoverUrl(data.coverUrl ?? "");
  }

  async function loadMedia(options?: { silent?: boolean }) {
    if (!id) return;
    const silent = Boolean(options?.silent);
    if (!silent) setLoadingMedia(true);
    if (!silent) setMediaError("");
    try {
      const { data } = await api.get(`/admin/events/${id}/media`);
      const items = (data as MediaAssetModel[]) ?? [];
      setMedia(items.filter((m) => m.status !== "EXPIRED"));
    } catch {
      if (!silent) {
        setMediaError("Não foi possível carregar as mídias deste evento.");
        setMedia([]);
      }
    } finally {
      if (!silent) setLoadingMedia(false);
    }
  }

  async function upload(files: FileList) {
    if (!id) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const list = Array.from(files);
      const totalBytes = list.reduce((sum, f) => sum + f.size, 0);
      let uploadedBytes = 0;
      const createdAll: MediaAssetModel[] = [];

      const updateOverall = (deltaUploaded: number) => {
        uploadedBytes += deltaUploaded;
        const pct = totalBytes ? Math.max(0, Math.min(100, Math.round((uploadedBytes / totalBytes) * 100))) : 0;
        setUploadProgress(pct);
      };

      const uploadChunked = async (file: File) => {
        const init = await api.post<{ uploadId: string }>(`/admin/events/${id}/media/upload/init`, {});
        const uploadId = init.data.uploadId;
        const chunkSize = 24 * 1024 * 1024; // 24MB
        let offset = 0;

        while (offset < file.size) {
          const end = Math.min(file.size, offset + chunkSize);
          const chunk = file.slice(offset, end);
          const chunkBytes = end - offset;
          let lastLoaded = 0;

          await api.post(`/admin/events/${id}/media/upload/chunk`, chunk, {
            headers: {
              "Content-Type": "application/octet-stream",
              "x-upload-id": uploadId,
              "x-file-name": file.name,
              "x-mime-type": file.type || "application/octet-stream",
              "x-file-size": String(file.size),
              "x-chunk-start": String(offset)
            },
            onUploadProgress: (e) => {
              const loaded = e.loaded ?? 0;
              const delta = Math.max(0, loaded - lastLoaded);
              lastLoaded = loaded;
              updateOverall(delta);
            }
          });

          // Some browsers/adapters won't report progress reliably; ensure we account full chunk.
          if (lastLoaded < chunkBytes) updateOverall(chunkBytes - lastLoaded);
          offset = end;
        }

        const { data } = await api.post<MediaAssetModel>(`/admin/events/${id}/media/upload/complete`, {
          uploadId,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          fileSize: file.size
        });
        return data;
      };

      const uploadSmallBatch = async (batch: File[]) => {
        const form = new FormData();
        for (const f of batch) form.append("files", f);
        const { data } = await api.post(`/admin/events/${id}/media/upload`, form, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const total = e.total ?? 0;
            if (!total) return;
            // Approximate: map this request progress to its batch size proportion.
            // We'll still update overall in a coarse way by forcing at end.
          }
        });
        const created = (data as MediaAssetModel[]) ?? [];
        return created;
      };

      const small: File[] = [];
      for (const file of list) {
        const isVideo = file.type.startsWith("video/");
        const needsChunked = isVideo || file.size > 20 * 1024 * 1024;
        if (needsChunked) {
          const created = await uploadChunked(file);
          createdAll.push(created);
        } else {
          small.push(file);
        }
      }

      if (small.length) {
        const created = await uploadSmallBatch(small);
        createdAll.push(...created);
        updateOverall(small.reduce((s, f) => s + f.size, 0));
      }

      if (createdAll.length) setConfigureMedia(createdAll);
      await loadMedia();
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }

  async function saveCover() {
    if (!id) return;
    setSavingCover(true);
    try {
      const next = coverUrl.trim() || undefined;
      const { data } = await api.put(`/admin/events/${id}`, { coverUrl: next });
      setEvent(data);
      setCoverUrl(data.coverUrl ?? "");
    } finally {
      setSavingCover(false);
    }
  }

  async function uploadCover(file: File) {
    if (!id) return;
    setUploadingCover(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post(`/admin/events/${id}/cover/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const nextUrl = (data?.coverUrl as string | undefined) ?? "";
      setCoverUrl(nextUrl);
      if (data?.event) setEvent(data.event);
      else await loadEvent();
    } finally {
      setUploadingCover(false);
    }
  }

  useEffect(() => {
    loadEvent();
    loadMedia();
  }, [id]);

  const hasProcessing = useMemo(() => media.some((m) => m.status === "PROCESSING"), [media]);
  useEffect(() => {
    if (!hasProcessing) return;
    const t = window.setInterval(() => {
      loadMedia({ silent: true });
    }, 2000);
    return () => window.clearInterval(t);
  }, [hasProcessing, id]);

  return (
    <section className="space-y-6 pb-20 md:pb-0">
      <PageHeader
        title="Mídias do evento"
        subtitle="Envie arquivos, acompanhe processamento e validade."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                if (!id) return;
                const ok = window.confirm("Reprocessar todas as mídias deste evento com a marca d’água atual?");
                if (!ok) return;
                await api.post(`/admin/events/${id}/media/reprocess`, {});
                await loadMedia();
              }}
              className="rounded-2xl"
            >
              <RefreshCw className="h-4 w-4" />
              Reprocessar tudo
            </Button>
            <Link to="/admin/eventos">
              <Button variant="secondary">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-adminCard/55 shadow-card backdrop-blur">
          <div className="relative aspect-[16/9] overflow-hidden bg-[#0D0D10]">
            {coverPreview ? <img src={coverPreview} alt="" className="h-full w-full object-cover" /> : null}
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.16),transparent_58%),linear-gradient(to_top,rgba(0,0,0,0.78),rgba(0,0,0,0.14),rgba(0,0,0,0.60))]" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Capa do evento</p>
              <p className="mt-1 line-clamp-1 text-lg font-semibold text-white">{event?.title ?? "Evento"}</p>
              <p className="mt-1 line-clamp-1 text-sm text-white/55">{event?.slug ?? "—"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-adminCard/55 p-5 shadow-soft backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                <ImageIcon className="h-3.5 w-3.5 text-cfGold" />
                Capa
              </p>
              <h2 className="mt-3 font-heading text-2xl text-white">Editar imagem de capa</h2>
              <p className="mt-2 text-sm text-white/60">Cole um link (URL) para a imagem. Ela será usada nos cards e na vitrine.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <Input
              tone="cine"
              label="URL da capa"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              hint="Dica: use uma imagem 16:9 em alta resolução."
            />

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCover(f);
                  if (e.currentTarget) e.currentTarget.value = "";
                }}
              />

              <Button variant="outline" className="rounded-2xl" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover}>
                <ImageIcon className="h-4 w-4" />
                {uploadingCover ? "Enviando..." : "Enviar imagem"}
              </Button>

              <Button variant="primary" className="rounded-2xl" onClick={saveCover} disabled={savingCover || uploadingCover}>
                <Save className="h-4 w-4" />
                {savingCover ? "Salvando..." : "Salvar capa"}
              </Button>
              <Link to={`/eventos/${event?.slug ?? ""}`} target="_blank" rel="noreferrer" className={!event?.slug ? "pointer-events-none opacity-40" : ""}>
                <Button variant="outline" className="w-full rounded-2xl">
                  <ImageIcon className="h-4 w-4" />
                  Ver na vitrine
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {uploading ? (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-3xl border border-white/10 bg-black/50 text-adminText">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-adminCard/80 px-4 py-3 text-sm font-semibold">
              <Upload className="h-4 w-4 text-cfGold" />
              {uploadProgress !== null ? `Enviando... ${uploadProgress}%` : "Enviando arquivos..."}
            </div>
          </div>
        ) : null}
        <UploadDropzone onSelect={upload} />
      </div>

      {mediaError ? (
        <EmptyState
          title="Falha ao carregar mídias"
          description={mediaError}
          actionLabel="Tentar novamente"
          onAction={() => loadMedia()}
          className="border-white/10 bg-white/[0.04] text-white"
        />
      ) : loadingMedia ? (
        <div className="h-56 rounded-3xl border border-white/10 bg-white/[0.04] animate-pulse" />
      ) : media.length ? (
        <MediaTable media={media} onRefresh={loadMedia} />
      ) : (
        <EmptyState
          title="Nenhuma mídia ainda"
          description="Envie fotos e vídeos acima para começar. Assim que processar, elas aparecem aqui."
          className="border-white/10 bg-white/[0.04] text-white"
        />
      )}

      <MediaMetaModal items={configureMedia} title="Definir preço e validade" onClose={() => setConfigureMedia(undefined)} onSaved={loadMedia} />
    </section>
  );
}
