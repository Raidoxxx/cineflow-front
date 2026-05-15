import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Camera,
  ChevronRight,
  Film,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Zap,
  Download,
  Lock
} from "lucide-react";
import { api, resolvePublicFileUrl } from "../../services/api";
import { EventModel } from "../../types";
import { EventCard } from "../../components/public/EventCard";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Select } from "../../components/ui/Select";
import { usePublicContent } from "../../hooks/use-public-content";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HomePage() {
  const { content } = usePublicContent();
  const [events, setEvents] = useState<EventModel[]>([]);
  const [query, setQuery] = useState("");
  const [filterAvailability, setFilterAvailability] = useState<"ALL" | "AVAILABLE">("AVAILABLE");
  const [filterPreset, setFilterPreset] = useState<"ALL" | "WEDDING" | "BIRTHDAY" | "GRADUATION" | "SPORTS" | "CORPORATE">("ALL");
  const [sort, setSort] = useState<"RECENT" | "AZ">("RECENT");
  const [loading, setLoading] = useState(false);

  async function loadEvents(search?: string) {
    setLoading(true);
    try {
      const { data } = await api.get<EventModel[]>(search ? `/public/events/search?q=${encodeURIComponent(search)}` : "/public/events");
      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  const availableEvents = useMemo(() => events.filter((e) => e.isPublic && e.isActive), [events]);
  const availableCount = availableEvents.length;

  const filteredEvents = useMemo(() => {
    const base = filterAvailability === "AVAILABLE" ? availableEvents : events;
    const byPreset =
      filterPreset === "ALL"
        ? base
        : base.filter((e) => {
            const t = `${e.title} ${e.description ?? ""}`.toLowerCase();
            if (filterPreset === "WEDDING") return /casamento|wedding|noivos/.test(t);
            if (filterPreset === "BIRTHDAY") return /anivers[aá]rio|birthday|festa/.test(t);
            if (filterPreset === "GRADUATION") return /formatura|graduation/.test(t);
            if (filterPreset === "SPORTS") return /corrida|run|sports|esporte|compet/i.test(t);
            if (filterPreset === "CORPORATE") return /corporativo|empresa|confer/i.test(t);
            return true;
          });

    const ordered = [...byPreset].sort((a, b) => {
      if (sort === "AZ") return a.title.localeCompare(b.title, "pt-BR");
      return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime();
    });

    return ordered;
  }, [events, availableEvents, filterAvailability, filterPreset, sort]);

  const heroCovers = useMemo(() => availableEvents.filter((e) => Boolean(e.coverUrl)).slice(0, 4), [availableEvents]);
  const featured = useMemo(() => filteredEvents.slice(0, 6), [filteredEvents]);
  const cms = content?.home ?? {};

  return (
    <main className="bg-[#08090B] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08090B]">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,70,85,0.20),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_bottom,#0D0D10,#08090B)]" />
        <div className="absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(700px_circle_at_30%_10%,black,transparent_60%)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.10)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-[0.20] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%224%22 height=%224%22%3E%3Cpath d=%22M0 0h1v1H0z%22 fill=%22white%22 fill-opacity=%220.18%22/%3E%3C/svg%3E')]" />

        <div className="relative cf-container py-14 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                <Film className="h-3.5 w-3.5 text-[#FF4655]" />
                {cms.heroEyebrow ?? "Produtora audiovisual • eventos • aftermovies"}
              </p>

              <h1 className="mt-6 text-balance font-heading text-5xl leading-[1.01] text-white md:text-6xl">
                {cms.heroTitle ?? "Seu evento virou filme. Agora ele está pronto para você."}
              </h1>
              <p className="mt-5 max-w-2xl text-base text-white/65 md:text-lg">
                {cms.heroSubtitle ?? "Encontre sua galeria, assista às prévias e compre fotos e vídeos profissionais do seu evento com segurança."}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Button
                  tone="light"
                  variant="primary"
                  size="lg"
                  onClick={() => scrollToId("buscar")}
                  className="rounded-2xl bg-[#FF4655] shadow-[0_28px_90px_rgba(255,70,85,0.22)]"
                >
                  Encontrar meu evento
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  tone="light"
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToId("galerias")}
                  className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white"
                >
                  Ver galerias
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 text-xs text-white/70">
                {[
                  { label: "Entrega digital", icon: <Download className="h-3.5 w-3.5 text-white/75" /> },
                  { label: "Compra segura", icon: <Lock className="h-3.5 w-3.5 text-white/75" /> },
                  { label: "Edição com identidade", icon: <Zap className="h-3.5 w-3.5 text-white/75" /> }
                ].map((i) => (
                  <span key={i.label} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">
                    {i.icon}
                    {i.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.75rem] bg-[radial-gradient(500px_circle_at_35%_10%,rgba(255,70,85,0.24),transparent_58%),radial-gradient(800px_circle_at_70%_90%,rgba(255,255,255,0.10),transparent_55%)] blur-2xl" />

              <div className="relative grid gap-4">
                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#141418] shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
                  <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.18),transparent_50%),linear-gradient(to_bottom,rgba(255,255,255,0.06),rgba(0,0,0,0.40))]" />
                  <div className="grid gap-3 p-4 sm:grid-cols-2">
                    {[0, 1].map((idx) => {
                      const item = heroCovers[idx];
                      const cover = item?.coverUrl ? resolvePublicFileUrl(item.coverUrl) : "";
                      return (
                        <div key={idx} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                          <div className="aspect-[4/3] bg-black">
                            {cover ? (
                              <img src={cover} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                            ) : (
                              <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.18),transparent_52%),linear-gradient(to_bottom,#101114,#07080A)]" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold text-white">{idx === 0 ? "Aftermovie" : "Fotos"}</p>
                              <p className="mt-0.5 text-[11px] text-white/55">{item?.title ?? "Prévia disponível"}</p>
                            </div>
                            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/40 text-white/85 backdrop-blur">
                              <Play className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="border-t border-white/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">Player</p>
                        <p className="mt-1 truncate font-heading text-2xl text-white">Prévia do evento</p>
                        <p className="mt-1 text-xs text-white/55">Cortes, cor e ritmo — identidade audiovisual.</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur">
                        <Sparkles className="h-4 w-4 text-[#FF4655]" />
                        Entrega digital
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Aftermovies", icon: <Film className="h-4 w-4" /> },
                    { label: "Fotos HQ", icon: <Camera className="h-4 w-4" /> },
                    { label: "Compra rápida", icon: <Lock className="h-4 w-4" /> }
                  ].map((it) => (
                    <div
                      key={it.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs font-semibold text-white/80 backdrop-blur"
                    >
                      <div className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white/85">{it.icon}</span>
                        <span>{it.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cf-container -mt-8 pb-12 md:-mt-12 md:pb-16">
        <div id="buscar" className="rounded-[2rem] border border-white/10 bg-[#0D0D10] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.60)] md:p-7">
          <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
            <Input
              tone="cine"
              label="Buscar meu evento"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome do evento, cidade, organizador…"
              startAdornment={<Search className="h-4 w-4" />}
              hint={`${availableCount} eventos disponíveis`}
            />
            <Button
              tone="light"
              variant="primary"
              size="lg"
              onClick={() => loadEvents(query)}
              disabled={loading}
              className="rounded-2xl bg-[#FF4655] shadow-[0_28px_90px_rgba(255,70,85,0.20)]"
            >
              Buscar
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Select
              tone="cine"
              label={
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-white/70" />
                  Filtros
                </span>
              }
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value as typeof filterAvailability)}
            >
              <option value="AVAILABLE">Somente disponíveis</option>
              <option value="ALL">Todos</option>
            </Select>
            <Select tone="cine" value={filterPreset} onChange={(e) => setFilterPreset(e.target.value as typeof filterPreset)} label="Categoria">
              <option value="ALL">Todas</option>
              <option value="WEDDING">Casamentos</option>
              <option value="BIRTHDAY">Aniversários</option>
              <option value="GRADUATION">Formaturas</option>
              <option value="SPORTS">Competições</option>
              <option value="CORPORATE">Corporativos</option>
            </Select>
            <Select tone="cine" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} label="Ordenar">
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
              <Button tone="light" variant="outline" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
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
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-3xl border border-white/10 bg-white/[0.04] animate-pulse" />
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
            <div className="pointer-events-none hidden md:block absolute left-6 right-6 top-8 h-px bg-white/10" />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: "Encontre seu evento", desc: "Busque pelo nome, cidade ou organizador.", icon: <Search className="h-5 w-5 text-[#FF4655]" /> },
                { title: "Veja as prévias", desc: "Assista aos vídeos e visualize as fotos com marca d’água.", icon: <Play className="h-5 w-5 text-white" /> },
                { title: "Compre e receba online", desc: "Checkout seguro e links por e-mail após pagamento.", icon: <Download className="h-5 w-5 text-white" /> }
              ].map((step, idx) => (
                <div
                  key={step.title}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur transition hover:-translate-y-0.5 hover:border-white/20"
                >
                  <div className="absolute -inset-10 opacity-0 transition duration-300 group-hover:opacity-100 bg-[radial-gradient(500px_circle_at_35%_20%,rgba(255,70,85,0.16),transparent_60%)]" />

                  <div className="relative flex items-center justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white/85 shadow-[0_18px_60px_rgba(0,0,0,0.35)]">
                      {step.icon}
                    </div>
                    <div className="text-xs font-semibold tracking-[0.22em] text-white/40">{String(idx + 1).padStart(2, "0")}</div>
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
            ) : null}
            <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.20),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="aspect-[4/3]" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 backdrop-blur">
              <p className="text-xs font-semibold text-white">{cms.aboutCardTitle ?? "Cineflow"}</p>
              <p className="mt-0.5 text-xs text-white/55">{cms.aboutCardSubtitle ?? "produtora de foto & vídeo para eventos"}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF4655]">{cms.aboutEyebrow ?? "Sobre a Cineflow"}</p>
            <h2 className="mt-3 font-heading text-4xl text-white md:text-5xl">{cms.aboutTitle ?? "Eventos reais. Imagem com identidade."}</h2>
            <p className="mt-4 max-w-2xl text-base text-white/65">
              {cms.aboutText ?? "A Cineflow registra rolês, festas e momentos sociais com estética audiovisual. Aqui, você encontra seu evento, assiste às prévias e compra suas mídias com segurança."}
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link to="/eventos#buscar">
                <Button tone="light" variant="primary" size="lg" className="rounded-2xl bg-[#FF4655]">
                  Encontrar meu evento
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/sobre">
                <Button tone="light" variant="outline" size="lg" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
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
              { title: "Filmagem profissional", desc: "Captação com movimento, estabilidade e linguagem de evento.", icon: <Film className="h-5 w-5 text-[#FF4655]" /> },
              { title: "Fotos em alta resolução", desc: "Arquivos limpos e nítidos para guardar e compartilhar.", icon: <Camera className="h-5 w-5 text-white" /> },
              { title: "Entrega digital", desc: "Links por e-mail, download organizado e rápido.", icon: <Download className="h-5 w-5 text-white" /> },
              { title: "Compra segura", desc: "Checkout confiável e processo transparente.", icon: <Lock className="h-5 w-5 text-white" /> },
              { title: "Edição com identidade", desc: "Cores, cortes e ritmo — assinatura audiovisual.", icon: <Zap className="h-5 w-5 text-white" /> },
              { title: "Cobertura de eventos", desc: "Do social ao corporativo, com a mesma presença.", icon: <Sparkles className="h-5 w-5 text-white" /> }
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white/90">{item.icon}</div>
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
                  { name: "Marina S.", text: "Achei meu evento na hora. As prévias são fortes e a compra foi tranquila. Recebi o download sem stress." },
                  { name: "Lucas R.", text: "A estética é de produtora mesmo. Dá confiança pra comprar e ficou tudo bem organizado." },
                  { name: "Camila P.", text: "Fotos lindas e vídeo com acabamento. A experiência parece streaming — muito melhor do que link perdido." }
                ]
            ).map((t: any) => (
              <div key={t.name} className="rounded-3xl border border-white/10 bg-[#141418] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{t.name}</p>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/75">
                  <Sparkles className="h-3.5 w-3.5 text-[#FF4655]" />
                  5.0
                </span>
              </div>
              <p className="mt-3 text-sm text-white/60">{t.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.20),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_right,#141418,#0D0D10)] p-6 shadow-[0_28px_140px_rgba(0,0,0,0.55)] md:p-8">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mt-2 font-heading text-3xl text-white">{cms.ctaTitle ?? "Bora ver sua prévia?"}</p>
              <p className="mt-2 text-sm text-white/60">{cms.ctaText ?? "Busque seu evento, assista e finalize a compra em minutos."}</p>
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
                <Button tone="light" variant="outline" size="lg" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
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
