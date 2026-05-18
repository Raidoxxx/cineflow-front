import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  Download,
  Film,
  Lock,
  MapPin,
  Play,
  Search,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Zap
} from "lucide-react";
import { api, resolvePublicFileUrl } from "../../services/api";
import { EventModel } from "../../types";
import { EventCard } from "../../components/public/EventCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Select } from "../../components/ui/Select";
import { usePublicContent } from "../../hooks/use-public-content";

type AvailabilityFilter = "ALL" | "AVAILABLE";
type PresetFilter = "ALL" | "WEDDING" | "BIRTHDAY" | "GRADUATION" | "SPORTS" | "CORPORATE";
type SortMode = "RECENT" | "AZ";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getCover(event: EventModel | undefined, fallbackIndex: number) {
  if (event?.coverUrl) return resolvePublicFileUrl(event.coverUrl);
  return "";
}

function getEventLocation(event: EventModel | undefined, fallback?: string) {
  if (!event) return fallback ?? "Evento";

  const raw = event as any;
  const cityState = [raw.city, raw.state].filter(Boolean).join(" • ");

  return raw.location || raw.address || raw.venueName || cityState || fallback || "Evento especial";
}

function getEventMeta(event: EventModel | undefined, fallback?: string) {
  if (!event) return fallback ?? "Fotos • Vídeo";

  const text = `${event.title} ${event.description ?? ""}`.toLowerCase();

  if (/casamento|wedding|noivos/.test(text)) return "Fotos";
  if (/aftermovie|show|festival|baile|festa|party/.test(text)) return "Aftermovie • Fotos";

  return fallback ?? "Fotos • Vídeo";
}

function eventMatchesPreset(event: EventModel, preset: PresetFilter) {
  if (preset === "ALL") return true;

  const text = `${event.title} ${event.description ?? ""}`.toLowerCase();

  if (preset === "WEDDING") return /casamento|wedding|noivos/.test(text);
  if (preset === "BIRTHDAY") return /anivers[aá]rio|birthday|festa/.test(text);
  if (preset === "GRADUATION") return /formatura|graduation/.test(text);
  if (preset === "SPORTS") return /corrida|run|sports|esporte|compet/i.test(text);
  if (preset === "CORPORATE") return /corporativo|empresa|confer/i.test(text);

  return true;
}

function MediaTile({
  src,
  className,
  badge,
  title,
  subtitle,
  showPlay,
  bigPlay
}: {
  src: string;
  className: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  showPlay?: boolean;
  bigPlay?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.04] shadow-[0_24px_90px_rgba(0,0,0,0.55)] ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.22),transparent_52%),linear-gradient(to_bottom,#101114,#07080A)]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_0%,rgba(255,70,85,0.28),transparent_48%)] opacity-70" />

      {badge ? (
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/85 backdrop-blur">
          {badge}
        </span>
      ) : null}

      {showPlay ? (
        <span
          className={
            bigPlay
              ? "absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/45 text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur"
              : "absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur"
          }
        >
          <Play className={bigPlay ? "h-7 w-7 fill-white/20" : "h-4 w-4"} />
        </span>
      ) : null}

      {title ? (
        <div className="absolute bottom-4 left-4 right-4">
          <p className="truncate text-sm font-semibold text-white">{title}</p>
          {subtitle ? <p className="mt-0.5 text-xs text-white/60">{subtitle}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function FeaturedEventCard({
  event,
  index
}: {
  event?: EventModel;
  index: number;
}) {
  if (!event) {
    return <div className="h-[236px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />;
  }

  const cover = event.coverUrl ? resolvePublicFileUrl(event.coverUrl) : "";
  const title = event.title;
  const location = getEventLocation(event);
  const meta = getEventMeta(event);

  return (
    <Link
      to={`/eventos/${event.id}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#15161A] shadow-[0_22px_80px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-1 hover:border-white/20"
    >
      <div className="relative h-36 overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.22),transparent_52%),linear-gradient(to_bottom,#101114,#07080A)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#15161A] via-black/10 to-transparent" />

        <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white/80 backdrop-blur">
          Prévia disponível
        </span>
      </div>

      <div className="relative p-4 pr-14">
        <h3 className="line-clamp-1 text-sm font-semibold text-white">{title}</h3>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/48">
          <MapPin className="h-3.5 w-3.5" />
          <span className="line-clamp-1">{location}</span>
        </p>

        <p className="mt-2 flex items-center gap-1.5 text-xs text-white/45">
          <Film className="h-3.5 w-3.5" />
          <span>{meta}</span>
        </p>

        <span className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/25 text-white/80 transition group-hover:border-[#FF4655]/50 group-hover:text-[#FF5A66]">
          <ShoppingBag className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

function FeaturePill({
  icon,
  title,
  text
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FF4655]/10 text-[#FF5A66] ring-1 ring-[#FF4655]/20">
        {icon}
      </span>

      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-xs text-white/45">{text}</span>
      </span>
    </div>
  );
}

export function HomePage() {
  const { content } = usePublicContent();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [query, setQuery] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<AvailabilityFilter>("AVAILABLE");
  const [filterPreset, setFilterPreset] = useState<PresetFilter>("ALL");
  const [sort, setSort] = useState<SortMode>("RECENT");
  const [loading, setLoading] = useState(false);

  async function loadEvents(search?: string) {
    setLoading(true);

    try {
      const { data } = await api.get<EventModel[]>(
        search ? `/public/events/search?q=${encodeURIComponent(search)}` : "/public/events"
      );

      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const availableEvents = useMemo(() => {
    return events.filter((event) => event.isPublic && event.isActive);
  }, [events]);

  const availableCount = availableEvents.length;

  const filteredEvents = useMemo(() => {
    const base = filterAvailability === "AVAILABLE" ? availableEvents : events;

    const byPreset = base.filter((event) => eventMatchesPreset(event, filterPreset));

    return [...byPreset].sort((a, b) => {
      if (sort === "AZ") return a.title.localeCompare(b.title, "pt-BR");

      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });
  }, [events, availableEvents, filterAvailability, filterPreset, sort]);

  const heroEvents = useMemo(() => availableEvents.slice(0, 8), [availableEvents]);
  const featured = useMemo(() => filteredEvents.slice(0, 6), [filteredEvents]);
  const highlightEvents = useMemo(() => filteredEvents.slice(0, 4), [filteredEvents]);
  const cms = content?.home ?? {};

  return (
    <main className="min-h-screen bg-[#07080A] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#07080A]">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_12%_12%,rgba(255,70,85,0.20),transparent_46%),radial-gradient(900px_circle_at_82%_22%,rgba(255,255,255,0.08),transparent_48%),linear-gradient(to_bottom,#101014_0%,#08090B_54%,#07080A_100%)]" />

        <div className="absolute inset-0 opacity-[0.14] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:62px_62px]" />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_120%,rgba(255,70,85,0.08),transparent_50%)]" />

        <div className="relative z-10 cf-container pb-10 pt-10 md:pb-14 md:pt-12 xl:pb-12">
          <div className="grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] xl:gap-12">
            <div className="max-w-[610px]">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white/72 backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-[3px] bg-[#FF4655]" />
                {cms.heroEyebrow ?? "Produtora audiovisual • eventos • aftermovies"}
              </p>

              <h1 className="mt-7 font-heading text-[3.7rem] font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-[4.9rem] lg:text-[5.1rem] xl:text-[5.7rem]">
                Reviva cada{" "}
                <span className="block bg-gradient-to-r from-[#FF6A6F] via-[#FF4655] to-[#D73658] bg-clip-text text-transparent">
                  momento.
                </span>
                Para sempre.
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-white/58 md:text-lg">
                {cms.heroSubtitle ??
                  "Prévia do seu evento em foto e vídeo. Compre e receba suas mídias completas de forma rápida e segura."}
              </p>

              <div id="buscar" className="mt-7 max-w-xl">
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.055] p-2 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                  <span className="ml-3 text-white/55">
                    <Search className="h-5 w-5" />
                  </span>

                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") loadEvents(query);
                    }}
                    placeholder="Nome do evento, cidade, organizador..."
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/38"
                  />

                  <Button
                    tone="light"
                    variant="primary"
                    size="md"
                    onClick={() => loadEvents(query)}
                    disabled={loading}
                    className="h-11 shrink-0 rounded-full bg-gradient-to-r from-[#E43D4A] to-[#FF5A66] px-5 text-sm font-bold shadow-[0_18px_70px_rgba(255,70,85,0.26)] hover:brightness-110"
                  >
                    Encontrar meu evento
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 grid max-w-md grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#FF4655]/10 text-[#FF5A66] ring-1 ring-[#FF4655]/20">
                    <Download className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">Entrega digital</span>
                    <span className="block text-xs text-white/45">Rápida e segura</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.055] text-white/85 ring-1 ring-white/10">
                    <Lock className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">Compra segura</span>
                    <span className="block text-xs text-white/45">Privacidade garantida</span>
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button
                  tone="light"
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToId("galerias")}
                  className="rounded-full border-white/15 bg-white/[0.025] px-6 text-white hover:bg-white/10 hover:text-white"
                >
                  Ver galerias
                  <ChevronRight className="h-4 w-4" />
                </Button>

              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(620px_circle_at_25%_18%,rgba(255,70,85,0.24),transparent_54%),radial-gradient(720px_circle_at_88%_72%,rgba(255,255,255,0.08),transparent_56%)] blur-2xl" />

              <div className="relative grid grid-cols-12 auto-rows-[54px] gap-3 md:auto-rows-[60px] xl:auto-rows-[64px]">
                <MediaTile
                  src={getCover(heroEvents[0], 0)}
                  className="col-span-5 row-span-3"
                  title={heroEvents[0]?.title}
                  subtitle={heroEvents[0] ? "Fotos • Vídeo" : undefined}
                />

                <MediaTile
                  src={getCover(heroEvents[1], 1)}
                  className="col-span-7 row-span-3"
                  badge="Aftermovie"
                  showPlay
                  bigPlay
                />

                <MediaTile
                  src={getCover(heroEvents[2], 2)}
                  className="col-span-6 row-span-2"
                />

                <MediaTile
                  src={getCover(heroEvents[3], 3)}
                  className="col-span-3 row-span-2"
                />

                <MediaTile
                  src={getCover(heroEvents[4], 4)}
                  className="col-span-3 row-span-2"
                />

                <MediaTile
                  src={getCover(heroEvents[5], 5)}
                  className="col-span-4 row-span-3"
                  badge="Prévia disponível"
                  showPlay
                  bigPlay
                />

                <MediaTile
                  src={getCover(heroEvents[6], 6)}
                  className="col-span-4 row-span-3"
                />

                <MediaTile
                  src={getCover(heroEvents[7], 7)}
                  className="col-span-4 row-span-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cf-container pb-8 pt-8 md:pb-12">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 shadow-[0_28px_120px_rgba(0,0,0,0.52)] backdrop-blur md:p-6">
          <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
            <div className="flex flex-col justify-center p-2">
              <h2 className="font-heading text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-4xl">
                Eventos em destaque
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-white/52">
                Confira os eventos com prévias disponíveis e reviva agora mesmo.
              </p>

              <Link to="/eventos" className="mt-7">
                <Button
                  tone="light"
                  variant="outline"
                  className="rounded-full border-white/15 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
                >
                  Ver todos os eventos
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <FeaturedEventCard key={highlightEvents[index]?.id ?? index} event={highlightEvents[index]} index={index} />
              ))}
            </div>
          </div>

          <div className="mt-8 grid overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] md:grid-cols-3">
            <FeaturePill
              icon={<Camera className="h-5 w-5" />}
              title="Qualidade profissional"
              text="Fotos e vídeos em alta resolução"
            />

            <FeaturePill
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Pagamento seguro"
              text="Ambiente 100% protegido"
            />

            <FeaturePill
              icon={<Download className="h-5 w-5" />}
              title="Download completo"
              text="Receba tudo em alta qualidade"
            />
          </div>
        </div>
      </section>

      <section className="cf-container pb-8 pt-0">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-4 shadow-[0_28px_120px_rgba(0,0,0,0.42)] backdrop-blur md:p-5">
          <div className="grid gap-3 md:grid-cols-3">
            <Select
              tone="cine"
              label={
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-white/70" />
                  Filtros
                </span>
              }
              value={filterAvailability}
              onChange={(event) => setFilterAvailability(event.target.value as AvailabilityFilter)}
            >
              <option value="AVAILABLE">Somente disponíveis</option>
              <option value="ALL">Todos</option>
            </Select>

            <Select
              tone="cine"
              value={filterPreset}
              onChange={(event) => setFilterPreset(event.target.value as PresetFilter)}
              label="Categoria"
            >
              <option value="ALL">Todas</option>
              <option value="WEDDING">Casamentos</option>
              <option value="BIRTHDAY">Aniversários</option>
              <option value="GRADUATION">Formaturas</option>
              <option value="SPORTS">Competições</option>
              <option value="CORPORATE">Corporativos</option>
            </Select>

            <Select
              tone="cine"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              label="Ordenar"
            >
              <option value="RECENT">Mais recentes</option>
              <option value="AZ">A → Z</option>
            </Select>
          </div>
        </div>
      </section>

      <section id="galerias" className="cf-container py-12 md:py-14">
        <SectionTitle
          eyebrow="Galerias"
          title="Galerias disponíveis"
          description="Escolha o seu evento para acessar a página com prévias e comprar suas mídias."
          tone="dark"
          actions={
            <Link to="/eventos" className="hidden md:block">
              <Button
                tone="light"
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white"
              >
                Ver todas
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          }
        />

        <div className="mt-8">
          {featured.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((event) => (
                <EventCard key={event.id} event={event} theme="dark" />
              ))}
            </div>
          ) : loading ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.04]" />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Nenhum evento encontrado"
              description="Tente buscar por outro termo ou aguarde a publicação de novas galerias."
              icon={<Search className="h-5 w-5" />}
              actionLabel="Recarregar"
              onAction={() => loadEvents()}
              className="border-white/10 bg-white/[0.04] text-white"
            />
          )}
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#0D0D10]">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_circle_at_18%_10%,rgba(255,70,85,0.16),transparent_56%),radial-gradient(900px_circle_at_85%_60%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:3px_3px]" />

        <div className="relative cf-container py-12 md:py-16">
          <SectionTitle
            tone="dark"
            eyebrow="Como funciona"
            title="Do evento ao download — sem enrolação"
            description="Uma experiência pensada para prévias, compra e entrega digital."
          />

          <div className="relative mt-10">
            <div className="pointer-events-none absolute left-6 right-6 top-8 hidden h-px bg-white/10 md:block" />

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Encontre seu evento",
                  desc: "Busque pelo nome, cidade ou organizador.",
                  icon: <Search className="h-5 w-5 text-[#FF4655]" />
                },
                {
                  title: "Veja as prévias",
                  desc: "Assista aos vídeos e visualize as fotos com marca d’água.",
                  icon: <Play className="h-5 w-5 text-white" />
                },
                {
                  title: "Compre e receba online",
                  desc: "Checkout seguro e links por e-mail após pagamento.",
                  icon: <Download className="h-5 w-5 text-white" />
                }
              ].map((step, index) => (
                <div
                  key={step.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div className="absolute -inset-10 bg-[radial-gradient(500px_circle_at_35%_20%,rgba(255,70,85,0.16),transparent_60%)] opacity-0 transition duration-300 group-hover:opacity-100" />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white/85 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                      {step.icon}
                    </div>

                    <div className="text-xs font-semibold tracking-[0.22em] text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  <h3 className="relative mt-4 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="relative mt-2 text-sm text-white/60">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cf-container py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#141418] shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
            {cms.aboutCardImageUrl ? (
              <img
                src={resolvePublicFileUrl(cms.aboutCardImageUrl)}
                alt={cms.aboutCardImageAlt ?? ""}
                className="absolute inset-0 h-full w-full object-cover opacity-95"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.20),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_bottom,#141418,#0B0C0E)]" />
            )}

            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.20),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="aspect-[4/3]" />

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
              <p className="text-xs font-semibold text-white">{cms.aboutCardTitle ?? "Cineflow"}</p>
              <p className="mt-0.5 text-xs text-white/55">
                {cms.aboutCardSubtitle ?? "produtora de foto & vídeo para eventos"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF4655]">
              {cms.aboutEyebrow ?? "Sobre a Cineflow"}
            </p>

            <h2 className="mt-3 font-heading text-4xl text-white md:text-5xl">
              {cms.aboutTitle ?? "Eventos reais. Imagem com identidade."}
            </h2>

            <p className="mt-4 max-w-2xl text-base text-white/65">
              {cms.aboutText ??
                "A Cineflow registra rolês, festas e momentos sociais com estética audiovisual. Aqui, você encontra seu evento, assiste às prévias e compra suas mídias com segurança."}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link to="/eventos#buscar">
                <Button tone="light" variant="primary" size="lg" className="rounded-2xl bg-[#FF4655]">
                  Encontrar meu evento
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link to="/sobre">
                <Button
                  tone="light"
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white"
                >
                  Saiba mais
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0D0D10]">
        <div className="cf-container py-12 md:py-16">
          <SectionTitle
            tone="dark"
            eyebrow="Diferenciais"
            title="Qualidade de produção, do clique ao aftermovie"
            description="O que você sente no vídeo e vê na foto: cuidado, técnica e identidade."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Filmagem profissional",
                desc: "Captação com movimento, estabilidade e linguagem de evento.",
                icon: <Film className="h-5 w-5 text-[#FF4655]" />
              },
              {
                title: "Fotos em alta resolução",
                desc: "Arquivos limpos e nítidos para guardar e compartilhar.",
                icon: <Camera className="h-5 w-5 text-white" />
              },
              {
                title: "Entrega digital",
                desc: "Links por e-mail, download organizado e rápido.",
                icon: <Download className="h-5 w-5 text-white" />
              },
              {
                title: "Compra segura",
                desc: "Checkout confiável e processo transparente.",
                icon: <Lock className="h-5 w-5 text-white" />
              },
              {
                title: "Edição com identidade",
                desc: "Cores, cortes e ritmo — assinatura audiovisual.",
                icon: <Zap className="h-5 w-5 text-white" />
              },
              {
                title: "Cobertura de eventos",
                desc: "Do social ao corporativo, com a mesma presença.",
                icon: <Sparkles className="h-5 w-5 text-white" />
              }
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white/90">
                  {item.icon}
                </div>

                <h3 className="mt-4 text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cf-container py-12 md:py-16">
        <SectionTitle
          tone="dark"
          eyebrow="Depoimentos"
          title="Quem comprou, recomenda"
          description="Experiência rápida, segura e com impacto visual."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(Array.isArray(cms.testimonials) && cms.testimonials.length
            ? cms.testimonials
            : [
                {
                  name: "Marina S.",
                  text: "Achei meu evento na hora. As prévias são fortes e a compra foi tranquila. Recebi o download sem stress."
                },
                {
                  name: "Lucas R.",
                  text: "A estética é de produtora mesmo. Dá confiança pra comprar e ficou tudo bem organizado."
                },
                {
                  name: "Camila P.",
                  text: "Fotos lindas e vídeo com acabamento. A experiência parece streaming — muito melhor do que link perdido."
                }
              ]
          ).map((testimonial: any) => (
            <div
              key={testimonial.name}
              className="rounded-3xl border border-white/10 bg-[#141418] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">{testimonial.name}</p>

                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/75">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF4655]" />
                  5.0
                </span>
              </div>

              <p className="mt-3 text-sm text-white/60">{testimonial.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.20),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_right,#141418,#0D0D10)] p-6 shadow-[0_28px_140px_rgba(0,0,0,0.55)] md:p-8">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-heading text-3xl text-white">{cms.ctaTitle ?? "Bora ver sua prévia?"}</p>
              <p className="mt-2 text-sm text-white/60">
                {cms.ctaText ?? "Busque seu evento, assista e finalize a compra em minutos."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              <Button
                tone="light"
                variant="primary"
                size="lg"
                onClick={() => scrollToId("buscar")}
                className="rounded-2xl bg-[#FF4655] shadow-[0_28px_90px_rgba(255,70,85,0.20)]"
              >
                Encontrar meu evento
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Link to="/eventos">
                <Button
                  tone="light"
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white"
                >
                  Ver galerias
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
