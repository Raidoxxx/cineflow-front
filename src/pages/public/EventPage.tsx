import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertTriangle, ChevronRight, Film, Grid3X3, Image as ImageIcon, Package, ShieldCheck } from "lucide-react";
import { api, resolvePublicFileUrl } from "../../services/api";
import { EventModel, MediaAssetModel } from "../../types";
import { MediaCard } from "../../components/public/MediaCard";
import { useCart } from "../../hooks/use-cart";
import { MediaPreviewModal } from "../../components/public/MediaPreviewModal";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { CartPanel, MobileCartBar } from "../../components/public/CartPanel";

type Filter = "ALL" | "PHOTO" | "VIDEO";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function EventPage() {
  const { slug } = useParams();
  const [event, setEvent] = useState<EventModel | null>(null);
  const [media, setMedia] = useState<MediaAssetModel[]>([]);
  const [typeFilter, setTypeFilter] = useState<Filter>("ALL");
  const [preview, setPreview] = useState<MediaAssetModel>();
  const [loading, setLoading] = useState(false);
  const cart = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api
      .get(`/public/events/${slug}`)
      .then((response) => {
        const data = response.data as EventModel & { mediaAssets: MediaAssetModel[] };
        setEvent(data);
        setMedia(data.mediaAssets ?? []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const eventExpired = event ? new Date(event.expiresAt) < new Date() : false;

  const stats = useMemo(() => {
    const ready = media.filter((m) => m.status === "READY");
    const photos = ready.filter((m) => m.type === "PHOTO");
    const videos = ready.filter((m) => m.type === "VIDEO");
    return { total: ready.length, photos: photos.length, videos: videos.length };
  }, [media]);

  const filtered = useMemo(() => {
    const now = new Date();
    return media.filter((item) => {
      if (typeFilter !== "ALL" && item.type !== typeFilter) return false;
      if (item.expiresAt && new Date(item.expiresAt) < now) return false;
      return item.status === "READY";
    });
  }, [media, typeFilter]);

  const cover = resolvePublicFileUrl(event?.coverUrl);
  const expLabel = event?.expiresAt ? new Date(event.expiresAt).toLocaleDateString("pt-BR") : undefined;

  return (
    <main className="pb-24 lg:pb-0">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08090B]">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,70,85,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_bottom,#0D0D10,#08090B)]" />
        {cover ? <img src={cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[1px]" /> : null}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(8,9,11,0.35),rgba(8,9,11,0.94))]" />

        <div className="relative cf-container py-10 md:py-14">
          <nav className="mb-4 flex items-center gap-2 text-xs text-white/55">
            <Link className="hover:text-white" to="/">
              Início
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link className="hover:text-white" to="/eventos">
              Galerias
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white/80">Evento</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                {eventExpired ? <Badge theme="dark" tone="danger">Evento expirado</Badge> : <Badge theme="dark" tone="gold">Evento disponível</Badge>}
                {expLabel ? <Badge theme="dark" tone="neutral">{`Disponível até ${expLabel}`}</Badge> : null}
              </div>

              <h1 className="mt-4 font-heading text-4xl text-white md:text-5xl">{event?.title ?? (loading ? "Carregando…" : "Evento")}</h1>
              {event?.description ? <p className="mt-3 max-w-3xl text-sm text-white/65 md:text-base">{event.description}</p> : null}

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-white/70">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">{`Fotos: ${stats.photos}`}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">{`Vídeos: ${stats.videos}`}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">{`Total: ${stats.total}`}</span>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {([
                  { key: "ALL", label: "Todos", icon: <Grid3X3 className="h-4 w-4" /> },
                  { key: "PHOTO", label: "Fotos", icon: <ImageIcon className="h-4 w-4" /> },
                  { key: "VIDEO", label: "Vídeos", icon: <Film className="h-4 w-4" /> }
                ] as const).map((item) => (
                  <Button
                    key={item.key}
                    tone="light"
                    variant={typeFilter === item.key ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter(item.key)}
                    className={typeFilter === item.key ? "rounded-full bg-[#FF4655]" : "rounded-full border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white"}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <CartPanel />
            </div>
          </div>
        </div>
      </section>

      <section id="midias" className="cf-container py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/55">Catálogo</p>
            <p className="mt-2 font-heading text-3xl text-white">Fotos e vídeos</p>
            <p className="mt-2 max-w-2xl text-sm text-white/60">Visualize prévias, selecione itens e finalize a compra no carrinho.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/carrinho">
              <Button tone="light" variant="primary" className="rounded-2xl bg-[#FF4655]">
                Abrir carrinho
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <MediaCard key={item.id} media={item} onAdd={cart.addItem} disabled={eventExpired} onPreview={(m) => setPreview(m)} />
            ))}
          </div>
        ) : loading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 rounded-3xl border border-white/10 bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma mídia disponível"
            description="Esta galeria não possui fotos/vídeos prontos para venda no momento — ou sua seleção de filtro não retornou resultados."
            icon={<AlertTriangle className="h-5 w-5" />}
            className="border-white/10 bg-white/[0.04]"
          />
        )}
      </section>

      <MobileCartBar />
      <MediaPreviewModal media={preview} onClose={() => setPreview(undefined)} />
    </main>
  );
}
