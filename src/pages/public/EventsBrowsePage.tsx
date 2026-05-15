import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, SlidersHorizontal, ShoppingBag, Film, MapPin } from "lucide-react";
import { api } from "../../services/api";
import { EventModel } from "../../types";
import { EventCard } from "../../components/public/EventCard";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/EmptyState";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Select } from "../../components/ui/Select";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function EventsBrowsePage() {
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

  return (
    <main className="bg-[#08090B] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08090B]">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,70,85,0.18),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_bottom,#0D0D10,#08090B)]" />
        <div className="relative cf-container py-12 md:py-14">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                <Film className="h-3.5 w-3.5 text-[#FF4655]" />
                Galerias e aftermovies
              </p>
              <h1 className="mt-5 font-heading text-4xl text-white md:text-5xl">Encontre seu evento</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/60 md:text-base">
                Pesquise pelo nome, cidade ou organizador. Acesse a galeria, veja prévias e compre suas mídias.
              </p>
            </div>
            <div className="hidden lg:flex gap-2">
              <Button
                tone="light"
                variant="primary"
                onClick={() => scrollToId("buscar")}
                className="rounded-2xl bg-[#FF4655] shadow-[0_18px_50px_rgba(255,70,85,0.20)]"
              >
                Ir para busca <ChevronRight className="h-4 w-4" />
              </Button>
              <Link to="/carrinho">
                <Button tone="light" variant="outline" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
                  <ShoppingBag className="h-4 w-4" />
                  Carrinho
                </Button>
              </Link>
            </div>
          </div>

          <div id="buscar" className="mt-8 rounded-[2rem] border border-white/10 bg-[#0D0D10] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.60)] md:p-7">
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

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/70">
              {[
                { label: "Encontre pelo nome/local", icon: <MapPin className="h-3.5 w-3.5 text-white/75" /> },
                { label: "Prévia antes de comprar", icon: <Film className="h-3.5 w-3.5 text-white/75" /> }
              ].map((i) => (
                <span key={i.label} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 backdrop-blur">
                  {i.icon}
                  {i.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cf-container py-12 md:py-14">
        <SectionTitle
          tone="dark"
          eyebrow="Vitrine"
          title="Galerias disponíveis"
          description="Selecione um evento para acessar a página com prévias e comprar suas mídias."
          actions={
            <Link to="/carrinho" className="hidden md:block">
              <Button tone="light" variant="outline" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
                <ShoppingBag className="h-4 w-4" />
                Carrinho
              </Button>
            </Link>
          }
        />

        <div className="mt-8">
          {filteredEvents.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
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
              className="border-white/10 bg-white/[0.04]"
            />
          )}
        </div>
      </section>
    </main>
  );
}

