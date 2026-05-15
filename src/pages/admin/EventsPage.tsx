import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Plus, Search, ExternalLink, Eye, X, CalendarDays, Timer } from "lucide-react";
import { api, resolvePublicFileUrl } from "../../services/api";
import { EventModel } from "../../types";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";

function formatDateBR(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR");
}

export function EventsPage() {
  const [events, setEvents] = useState<EventModel[]>([]);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    api.get("/admin/events").then((response) => setEvents(response.data));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) => [e.title, e.slug, e.description].filter(Boolean).some((t) => String(t).toLowerCase().includes(q)));
  }, [events, query]);

  const stats = useMemo(() => {
    const now = new Date();
    let expired = 0;
    let active = 0;
    for (const e of events) {
      const isExpired = new Date(e.expiresAt) < now;
      if (isExpired) expired += 1;
      else if (e.isActive) active += 1;
    }
    return { total: events.length, active, expired };
  }, [events]);

  async function copyPublicLink(event: EventModel) {
    const url = `${window.location.origin}/eventos/${event.slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(event.id);
    window.setTimeout(() => setCopiedId((v) => (v === event.id ? null : v)), 1400);
  }

  return (
    <section className="space-y-6 pb-20 md:pb-0">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-adminCard/60 p-5 shadow-card backdrop-blur md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_circle_at_10%_0%,rgba(255,70,85,0.12),transparent_55%),radial-gradient(900px_circle_at_90%_30%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay [background-image:radial-gradient(rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:3px_3px]" />

        <div className="relative">
          <PageHeader
            title="Eventos"
            subtitle="Crie e gerencie galerias, validade e links públicos."
            actions={
              <Link to="/admin/eventos/novo">
                <Button variant="primary" className="rounded-2xl">
                  <Plus className="h-4 w-4" />
                  Novo evento
                </Button>
              </Link>
            }
          />

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur">
              Total <span className="text-white">{stats.total}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur">
              Ativos <span className="text-white">{stats.active}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-white/75 backdrop-blur">
              Expirados <span className="text-white">{stats.expired}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-adminCard/50 p-4 shadow-soft backdrop-blur md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-xl">
            <Input
              tone="cine"
              label="Buscar eventos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por título, slug ou descrição…"
              startAdornment={<Search className="h-4 w-4" />}
              endAdornment={
                query ? (
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-black/20 text-white/70 hover:bg-white/[0.06] hover:text-white"
                    onClick={() => setQuery("")}
                    aria-label="Limpar busca"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null
              }
              hint={`${filtered.length} resultado(s)`}
            />
          </div>

          <div className="flex items-center gap-2">
            <Link to="/eventos" target="_blank" rel="noreferrer">
              <Button variant="outline" className="rounded-2xl">
                <ExternalLink className="h-4 w-4" />
                Abrir vitrine
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {!filtered.length ? (
        <EmptyState
          title="Nenhum evento encontrado"
          description="Crie um novo evento para começar a vender fotos e vídeos."
          actionLabel="Novo evento"
          onAction={() => (window.location.href = "/admin/eventos/novo")}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((event) => {
            const expired = new Date(event.expiresAt) < new Date();
            const coverUrl = resolvePublicFileUrl(event.coverUrl?.trim());
            return (
              <div key={event.id} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-adminCard/55 shadow-card backdrop-blur">
                <div className="relative aspect-[16/7] overflow-hidden bg-[#0D0D10]">
                  {coverUrl ? <img src={coverUrl} alt="" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" /> : null}
                  <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.14),transparent_58%),linear-gradient(to_top,rgba(0,0,0,0.70),rgba(0,0,0,0.10),rgba(0,0,0,0.55))]" />
                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {expired ? <Badge tone="danger">Expirado</Badge> : event.isActive ? <Badge tone="success">Ativo</Badge> : <Badge tone="neutral">Inativo</Badge>}
                    <Badge tone={event.isPublic ? "info" : "neutral"}>{event.isPublic ? "Público" : "Privado"}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="line-clamp-1 text-lg font-semibold text-white">{event.title}</p>
                    <p className="mt-1 line-clamp-1 text-sm text-white/60">{event.description?.trim() ? event.description : "Sem descrição"}</p>
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <div className="flex flex-wrap gap-2 text-xs text-white/60">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 backdrop-blur">
                      <CalendarDays className="h-4 w-4 text-white/70" />
                      Data <span className="text-white/85">{formatDateBR(event.eventDate)}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 backdrop-blur">
                      <Timer className="h-4 w-4 text-white/70" />
                      Expira <span className="text-white/85">{formatDateBR(event.expiresAt)}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 font-mono text-[11px] text-white/70 backdrop-blur">
                      {event.slug}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <Button variant={copiedId === event.id ? "secondary" : "outline"} size="sm" className="rounded-2xl" onClick={() => copyPublicLink(event)}>
                      <Copy className="h-4 w-4" />
                      {copiedId === event.id ? "Copiado" : "Copiar link"}
                    </Button>
                    <Link to={`/eventos/${event.slug}`} target="_blank" rel="noreferrer" className="sm:col-span-1">
                      <Button variant="outline" size="sm" className="w-full rounded-2xl">
                        <ExternalLink className="h-4 w-4" />
                        Abrir público
                      </Button>
                    </Link>
                    <Link to={`/admin/eventos/${event.id}`} className="sm:col-span-1">
                      <Button variant="primary" size="sm" className="w-full rounded-2xl">
                        <Eye className="h-4 w-4" />
                        Gerenciar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

