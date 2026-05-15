import { Link } from "react-router-dom";
import { Instagram, Mail, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";

export function PublicFooter() {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<{ companyName?: string; publicContent?: any }>({});

  useEffect(() => {
    api
      .get("/public/settings")
      .then((r) => setSettings(r.data ?? {}))
      .catch(() => undefined);
  }, []);

  const companyName = settings.companyName?.trim() || "Cineflow";
  const cmsFooter = settings.publicContent?.footer ?? {};
  const contactEmail = cmsFooter.contactEmail ?? "contato@cineflow.com";
  const whatsappUrl = cmsFooter.whatsappUrl ?? "";
  const instagramUrl = cmsFooter.instagramUrl ?? "";
  const supportText = cmsFooter.supportText ?? "Dúvidas sobre seu vídeo/álbum? Fale com a gente e receba suporte rápido.";
  const blurb =
    cmsFooter.blurb ??
    "Produtora de foto e vídeo para eventos. Encontre sua galeria, veja prévias e compre suas mídias com entrega digital.";

  const mailto = useMemo(() => (contactEmail ? `mailto:${contactEmail}` : ""), [contactEmail]);

  return (
    <footer className="mt-16 border-t border-white/10 bg-[#08090B]">
      <div className="cf-container py-12">
        <div className="grid gap-10 md:grid-cols-[1.35fr_1fr_1fr]">
          <div>
            <p className="font-heading text-2xl text-white">{companyName}</p>
            <p className="mt-2 max-w-md text-sm text-white/60">{blurb}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/75">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#FF4655]" />
                Compra segura
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-white/80" />
                Qualidade premium
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                <Mail className="h-3.5 w-3.5 text-white/80" />
                Entrega digital
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/85">Links</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li>
                <Link className="hover:text-white" to="/eventos">
                  Galerias
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" to="/eventos#buscar">
                  Encontrar meu evento
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" to="/carrinho">
                  Carrinho
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" to="/sobre">
                  A Cinefllow
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white/85">Contato</p>
            <p className="mt-3 text-sm text-white/60">{supportText}</p>
            <div className="mt-4 grid gap-2">
              <a
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/[0.06]"
                href={whatsappUrl || "#"}
                target={whatsappUrl ? "_blank" : undefined}
                rel={whatsappUrl ? "noreferrer" : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-white/70" />
                  WhatsApp
                </span>
              </a>
              <a
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/[0.06]"
                href={mailto || "#"}
              >
                <span className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-white/70" />
                  {contactEmail}
                </span>
              </a>
              <a
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/[0.06]"
                href={instagramUrl || "#"}
                target={instagramUrl ? "_blank" : undefined}
                rel={instagramUrl ? "noreferrer" : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-white/70" />
                  Instagram
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>{`© ${year} ${companyName}. Todos os direitos reservados.`}</p>
          <p className="text-white/35">{cmsFooter.fineprint ?? "Fotos e vídeos por evento • aftermovies • entrega digital."}</p>
        </div>
      </div>
    </footer>
  );
}
