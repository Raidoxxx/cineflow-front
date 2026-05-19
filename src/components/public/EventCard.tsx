import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, ChevronRight, Clock, Image as ImageIcon, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { EventModel } from "../../types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { resolveAlternatePublicFileUrl, resolvePublicFileUrl } from "../../services/api";

export function EventCard({ event, theme = "light" }: { event: EventModel; theme?: "light" | "dark" }) {
  const navigate = useNavigate();
  const available = Boolean(event.isPublic && event.isActive);
  const expDate = new Date(event.expiresAt).toLocaleDateString("pt-BR");
  const eventDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString("pt-BR") : undefined;
  const isDark = theme === "dark";
  const cover = resolvePublicFileUrl(event.coverUrl);
  const [coverSrc, setCoverSrc] = useState(cover);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    setCoverError(false);
    setCoverSrc(cover);
  }, [cover]);

  return (
    <article
      className={
        isDark
          ? "group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-[#141418] shadow-[0_28px_120px_rgba(0,0,0,0.45)] transition-all hover:-translate-y-1 hover:border-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4655]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090B]"
          : "group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(17,24,39,0.08)] transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_22px_90px_rgba(17,24,39,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C63FF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      }
      role="link"
      tabIndex={0}
      onClick={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.closest("a,button")) return;
        navigate(`/eventos/${event.slug}`);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(`/eventos/${event.slug}`);
        }
      }}
    >
      <div className={isDark ? "relative aspect-[16/10] overflow-hidden bg-black" : "relative aspect-[16/10] overflow-hidden bg-slate-100"}>
        {coverSrc && !coverError ? (
          <img
            src={coverSrc}
            alt={event.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            onError={() => {
              const alt = resolveAlternatePublicFileUrl(event.coverUrl);
              if (alt && alt !== coverSrc) setCoverSrc(alt);
              else setCoverError(true);
            }}
          />
        ) : (
          <div
            className={
              isDark
                ? "absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.22),transparent_48%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.10),transparent_55%),linear-gradient(to_bottom,#101114,#07080A)]"
                : "absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(108,99,255,0.22),transparent_48%),radial-gradient(900px_circle_at_80%_30%,rgba(255,79,94,0.16),transparent_55%),linear-gradient(to_bottom,#ffffff,#f3f4f6)]"
            }
          />
        )}
        <div className={isDark ? "absolute inset-0 bg-gradient-to-t from-black/85 via-black/5 to-transparent" : "absolute inset-0 bg-gradient-to-t from-white/95 via-white/0 to-transparent"} />

        {isDark ? (
          <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-black/40 text-white/85 backdrop-blur">
            <Play className="h-4 w-4" />
          </div>
        ) : null}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              isDark
                ? "inline-flex items-center rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/80"
                : "inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700"
            }
          >
            {available ? "Disponível" : "Indisponível"}
          </span>
          {isDark ? (
            <Badge theme="dark" tone="neutral" className="bg-white/5 text-white/80">
              Aftermovie
            </Badge>
          ) : (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#6C63FF]">
              Evento
            </span>
          )}
        </div>

        <div className="space-y-1">
          <h3 className={isDark ? "text-balance font-heading text-2xl text-white" : "text-balance font-heading text-2xl text-slate-900"}>
            {event.title}
          </h3>
          <p className={isDark ? "line-clamp-2 text-sm text-white/60" : "line-clamp-2 text-sm text-slate-600"}>
            {event.description?.trim() ? event.description : "Sem descrição."}
          </p>
        </div>

        <div className={isDark ? "flex flex-wrap gap-2 text-xs text-white/65" : "flex flex-wrap gap-2 text-xs text-slate-600"}>
          {eventDate ? (
            <span
              className={
                isDark
                  ? "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"
                  : "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"
              }
            >
              <CalendarDays className={isDark ? "h-3.5 w-3.5 text-white/60" : "h-3.5 w-3.5 text-slate-500"} />
              {eventDate}
            </span>
          ) : null}
          <span
            className={
              isDark
                ? "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"
                : "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"
            }
          >
            <Clock className={isDark ? "h-3.5 w-3.5 text-white/60" : "h-3.5 w-3.5 text-slate-500"} />
            {`Disponível até ${expDate}`}
          </span>
          <span
            className={
              isDark
                ? "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1"
                : "inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1"
            }
          >
            <ImageIcon className={isDark ? "h-3.5 w-3.5 text-white/60" : "h-3.5 w-3.5 text-slate-500"} />
            Fotos + vídeos
          </span>
        </div>

        <Link to={`/eventos/${event.slug}`} className="block">
          <Button
            tone="light"
            variant="primary"
            fullWidth
            className={isDark ? "rounded-2xl bg-[#FF4655] shadow-[0_18px_50px_rgba(255,70,85,0.22)]" : "rounded-2xl"}
          >
            Ver evento
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </article>
  );
}
