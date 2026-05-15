import { Link } from "react-router-dom";
import { Award, Camera, ChevronRight, Film, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { Button } from "../../components/ui/Button";
import { usePublicContent } from "../../hooks/use-public-content";

export function AboutPage() {
  const { content } = usePublicContent();
  const cms = content?.about ?? {};

  const defaultSections = [
    {
      eyebrow: "Sobre",
      title: "Especialistas em eventos e pessoas",
      description: "Casamentos, aniversários, formaturas, competições e encontros — com qualidade e presença de produção.",
      cards: [
        { title: "Confiança", desc: "Processo claro, compra segura e entrega digital." },
        { title: "Qualidade", desc: "Fotos em alta resolução e vídeos com acabamento premium." },
        { title: "Emoção", desc: "Narrativa visual para reviver o momento com impacto." }
      ]
    },
    {
      eyebrow: "Método",
      title: "Do clique ao aftermovie",
      description: "Captação + edição + entrega, com linguagem de vídeo e fotografia de evento.",
      cards: [
        { title: "Captação", desc: "Câmera na mão, ritmo e presença para registrar o real." },
        { title: "Edição", desc: "Cor, corte e narrativa com identidade audiovisual." },
        { title: "Entrega", desc: "Prévia, compra e download — simples e seguro." }
      ]
    }
  ];

  const sections = Array.isArray(cms.sections) && cms.sections.length ? cms.sections : defaultSections;
  const sectionOne = sections[0] ?? defaultSections[0];
  const sectionTwo = sections[1] ?? defaultSections[1];

  return (
    <main className="bg-[#08090B] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[#08090B]">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,70,85,0.20),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_bottom,#0D0D10,#08090B)]" />
        <div className="relative cf-container py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                <Award className="h-3.5 w-3.5 text-[#FF4655]" />
                {cms.badge ?? "Produtora de fotografia e filmagem de eventos"}
              </p>
              <h1 className="mt-5 font-heading text-5xl leading-[1.02] text-white md:text-6xl">{cms.title ?? "Eventos reais. Estética audiovisual."}</h1>
              <p className="mt-5 max-w-2xl text-base text-white/65 md:text-lg">
                {cms.subtitle ??
                  "A Cineflow registra rolês, festas e momentos sociais com linguagem de vídeo — captação, edição e entrega digital com experiência premium."}
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                <Link to="/eventos#buscar">
                  <Button tone="light" variant="primary" size="lg" className="rounded-2xl bg-[#FF4655] shadow-[0_18px_50px_rgba(255,70,85,0.20)]">
                    Encontrar meu evento
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/eventos">
                  <Button tone="light" variant="outline" size="lg" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
                    Ver galerias
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.75rem] bg-[radial-gradient(500px_circle_at_35%_10%,rgba(255,70,85,0.24),transparent_58%),radial-gradient(800px_circle_at_70%_90%,rgba(255,255,255,0.10),transparent_55%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-[#141418] shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
                <div className="aspect-[4/3] bg-[radial-gradient(900px_circle_at_20%_0%,rgba(255,70,85,0.20),transparent_52%),radial-gradient(900px_circle_at_80%_30%,rgba(255,255,255,0.08),transparent_55%),linear-gradient(to_bottom,#141418,#0D0D10)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
                  <p className="text-xs font-semibold text-white">{cms.signatureTitle ?? "Assinatura visual"}</p>
                  <p className="mt-0.5 text-xs text-white/55">{cms.signatureSubtitle ?? "flash • movimento • filme"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cf-container py-12 md:py-16">
        <SectionTitle
          tone="dark"
          eyebrow={sectionOne.eyebrow ?? "Sobre"}
          title={sectionOne.title ?? "Especialistas em eventos e pessoas"}
          description={
            sectionOne.description ?? "Casamentos, aniversários, formaturas, competições e encontros — com qualidade e presença de produção."
          }
        />

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {(
            Array.isArray(sectionOne.cards) && sectionOne.cards.length
              ? sectionOne.cards
              : [
                  { title: "Confiança", desc: "Processo claro, compra segura e entrega digital." },
                  { title: "Qualidade", desc: "Fotos em alta resolução e vídeos com acabamento premium." },
                  { title: "Emoção", desc: "Narrativa visual para reviver o momento com impacto." }
                ]
          ).map((item: any, idx: number) => {
            const icon =
              idx === 0 ? (
                <ShieldCheck className="h-5 w-5 text-[#FF4655]" />
              ) : idx === 1 ? (
                <Sparkles className="h-5 w-5 text-white" />
              ) : (
                <Heart className="h-5 w-5 text-white" />
              );
            return (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white/90">{icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0D0D10]">
        <div className="cf-container py-12 md:py-16">
          <SectionTitle
            tone="dark"
            eyebrow={sectionTwo.eyebrow ?? "Método"}
            title={sectionTwo.title ?? "Do clique ao aftermovie"}
            description={sectionTwo.description ?? "Captação + edição + entrega, com linguagem de vídeo e fotografia de evento."}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(
              Array.isArray(sectionTwo.cards) && sectionTwo.cards.length
                ? sectionTwo.cards
                : [
                    { title: "Captação", desc: "Câmera na mão, ritmo e presença para registrar o real." },
                    { title: "Edição", desc: "Cor, corte e narrativa com identidade audiovisual." },
                    { title: "Entrega", desc: "Prévia, compra e download — simples e seguro." }
                  ]
            ).map((s: any, idx: number) => {
              const icon =
                idx === 0 ? (
                  <Camera className="h-5 w-5 text-[#FF4655]" />
                ) : idx === 1 ? (
                  <Film className="h-5 w-5 text-white" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-white" />
                );
              return (
                <div key={s.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/25 text-white/90">{icon}</div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
