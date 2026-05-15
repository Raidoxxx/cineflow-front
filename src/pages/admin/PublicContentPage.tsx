import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { api, resolvePublicFileUrl } from "../../services/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";

export function PublicContentPage() {
  const [content, setContent] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/public-content")
      .then((r) => setContent(r.data ?? {}))
      .catch(() => setError("Não foi possível carregar o conteúdo público."));
  }, []);

  const cms = useMemo(() => (content ?? {}) as any, [content]);
  const cmsNavbar = cms.navbar ?? {};
  const cmsHome = cms.home ?? {};
  const cmsAbout = cms.about ?? {};
  const cmsFooter = cms.footer ?? {};

  const setAt = (path: string, value: any) => {
    setContent((prev: any) => {
      const next = { ...(prev ?? {}) };
      const keys = path.split(".");
      let cur: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        cur[k] = typeof cur[k] === "object" && cur[k] != null ? { ...cur[k] } : {};
        cur = cur[k];
      }
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };

  async function save() {
    setError("");
    setSaved(false);
    if (!content) return;
    setSaving(true);
    try {
      await api.put("/admin/public-content", { publicContent: content });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Falha ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  const testimonials: Array<{ name?: string; text?: string }> = Array.isArray(cmsHome.testimonials) ? cmsHome.testimonials : [];

  const aboutSections: Array<any> = Array.isArray(cmsAbout.sections) ? cmsAbout.sections : [];
  const sectionOne = aboutSections[0] ?? { eyebrow: "", title: "", description: "", cards: [] };
  const sectionTwo = aboutSections[1] ?? { eyebrow: "", title: "", description: "", cards: [] };

  async function uploadImage(target: "home.aboutCardImageUrl", file: File) {
    const form = new FormData();
    form.append("target", target);
    form.append("file", file);
    const r = await api.post("/admin/public-content/assets/upload", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    if (r.data?.publicContent) {
      setContent(r.data.publicContent);
    } else if (r.data?.url) {
      setAt(target, r.data.url);
    }
  }

  return (
    <section className="space-y-6 pb-24 md:pb-0">
      <PageHeader
        title="Conteúdo do site"
        subtitle="Edite os textos do site público (Home, Sobre, Navbar e Footer)."
        actions={
          <div className="flex items-center gap-2">
            {saved ? <Badge tone="success">Salvo</Badge> : null}
            <Button variant="primary" onClick={save} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        }
      />

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <Card className="bg-adminCard/60">
        <CardHeader>
          <p className="text-sm font-semibold text-white/90">Navbar</p>
          <p className="mt-1 text-xs text-white/55">Rótulos do menu e frase abaixo do nome.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Input
            tone="cine"
            label="Texto do menu “Sobre”"
            value={cmsNavbar.aboutLabel ?? ""}
            onChange={(e) => setAt("navbar.aboutLabel", e.target.value)}
            placeholder="A Cineflow"
          />
          <Input
            tone="cine"
            label="Texto do menu “Galerias”"
            value={cmsNavbar.galleriesLabel ?? ""}
            onChange={(e) => setAt("navbar.galleriesLabel", e.target.value)}
            placeholder="Galerias"
          />
          <Input
            tone="cine"
            label="Frase (tagline)"
            value={cmsNavbar.tagline ?? ""}
            onChange={(e) => setAt("navbar.tagline", e.target.value)}
            placeholder="Produtora • Foto • Vídeo"
          />
        </CardContent>
      </Card>

      <Card className="bg-adminCard/60">
        <CardHeader>
          <p className="text-sm font-semibold text-white/90">Home</p>
          <p className="mt-1 text-xs text-white/55">Hero, bloco “Sobre” e CTA.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            tone="cine"
            label="Hero (linha pequena)"
            value={cmsHome.heroEyebrow ?? ""}
            onChange={(e) => setAt("home.heroEyebrow", e.target.value)}
            placeholder="Produtora audiovisual • eventos • aftermovies"
          />
          <Input
            tone="cine"
            label="Hero (título)"
            value={cmsHome.heroTitle ?? ""}
            onChange={(e) => setAt("home.heroTitle", e.target.value)}
            placeholder="Seu evento virou filme..."
          />
          <Textarea
            label="Hero (subtítulo)"
            value={cmsHome.heroSubtitle ?? ""}
            onChange={(e) => setAt("home.heroSubtitle", e.target.value)}
            placeholder="Encontre sua galeria..."
          />

          <Input
            tone="cine"
            label="Card (título curto)"
            value={cmsHome.aboutCardTitle ?? ""}
            onChange={(e) => setAt("home.aboutCardTitle", e.target.value)}
            placeholder="Cineflow"
          />
          <Input
            tone="cine"
            label="Card (subtítulo curto)"
            value={cmsHome.aboutCardSubtitle ?? ""}
            onChange={(e) => setAt("home.aboutCardSubtitle", e.target.value)}
            placeholder="produtora de foto & vídeo para eventos"
          />

          <div className="md:col-span-2 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white/90">Imagem do card (Home)</p>
                <p className="mt-1 text-xs text-white/55">Essa imagem aparece no bloco “Sobre” da Home.</p>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white/85 hover:bg-white/[0.06]">
                Enviar imagem
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    uploadImage("home.aboutCardImageUrl", file).catch(() => setError("Falha ao enviar imagem."));
                    e.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            {cmsHome.aboutCardImageUrl ? (
              <div className="grid gap-3 md:grid-cols-[220px_1fr] md:items-start">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <img src={resolvePublicFileUrl(cmsHome.aboutCardImageUrl)} alt="" className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="grid gap-3">
                  <Input
                    tone="cine"
                    label="Alt (acessibilidade)"
                    value={cmsHome.aboutCardImageAlt ?? ""}
                    onChange={(e) => setAt("home.aboutCardImageAlt", e.target.value)}
                    placeholder="Descrição da imagem"
                  />
                  <Input
                    tone="cine"
                    label="URL (opcional)"
                    value={cmsHome.aboutCardImageUrl ?? ""}
                    onChange={(e) => setAt("home.aboutCardImageUrl", e.target.value)}
                    placeholder="/public-files/..."
                    hint="Você pode colar uma URL pública (ex: /public-files/...)."
                  />
                </div>
              </div>
            ) : (
              <Input
                tone="cine"
                label="URL da imagem (opcional)"
                value={cmsHome.aboutCardImageUrl ?? ""}
                onChange={(e) => setAt("home.aboutCardImageUrl", e.target.value)}
                placeholder="/public-files/..."
                hint="Clique em “Enviar imagem” ou cole uma URL pública."
              />
            )}
          </div>

          <Input
            tone="cine"
            label="Bloco “Sobre” (título pequeno)"
            value={cmsHome.aboutEyebrow ?? ""}
            onChange={(e) => setAt("home.aboutEyebrow", e.target.value)}
            placeholder="Sobre a Cineflow"
          />
          <Input
            tone="cine"
            label="Bloco “Sobre” (título)"
            value={cmsHome.aboutTitle ?? ""}
            onChange={(e) => setAt("home.aboutTitle", e.target.value)}
            placeholder="Eventos reais..."
          />
          <Textarea
            label="Bloco “Sobre” (texto)"
            value={cmsHome.aboutText ?? ""}
            onChange={(e) => setAt("home.aboutText", e.target.value)}
            placeholder="A Cineflow registra..."
          />

          <Input
            tone="cine"
            label="CTA (título)"
            value={cmsHome.ctaTitle ?? ""}
            onChange={(e) => setAt("home.ctaTitle", e.target.value)}
            placeholder="Bora ver sua prévia?"
          />
          <Input
            tone="cine"
            label="CTA (texto)"
            value={cmsHome.ctaText ?? ""}
            onChange={(e) => setAt("home.ctaText", e.target.value)}
            placeholder="Busque seu evento..."
          />
        </CardContent>
      </Card>

      <Card className="bg-adminCard/60">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white/90">Depoimentos (Home)</p>
              <p className="mt-1 text-xs text-white/55">Lista de cards com nome e texto.</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => setAt("home.testimonials", [...testimonials, { name: "", text: "" }])}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {testimonials.length ? (
            testimonials.map((t, idx) => (
              <div key={idx} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
                <Input
                  tone="cine"
                  label="Nome"
                  value={t?.name ?? ""}
                  onChange={(e) => {
                    const next = [...testimonials];
                    next[idx] = { ...(next[idx] ?? {}), name: e.target.value };
                    setAt("home.testimonials", next);
                  }}
                  placeholder="Maria"
                />
                <Textarea
                  label="Texto"
                  value={t?.text ?? ""}
                  onChange={(e) => {
                    const next = [...testimonials];
                    next[idx] = { ...(next[idx] ?? {}), text: e.target.value };
                    setAt("home.testimonials", next);
                  }}
                  placeholder="Achei meu evento..."
                />
                <Button
                  variant="danger"
                  onClick={() => {
                    const next = testimonials.filter((_, i) => i !== idx);
                    setAt("home.testimonials", next);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-white/60">Nenhum depoimento. Clique em “Adicionar”.</p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-adminCard/60">
        <CardHeader>
          <p className="text-sm font-semibold text-white/90">Página “Sobre”</p>
          <p className="mt-1 text-xs text-white/55">Header e seções.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            tone="cine"
            label="Badge (linha pequena)"
            value={cmsAbout.badge ?? ""}
            onChange={(e) => setAt("about.badge", e.target.value)}
            placeholder="Produtora de fotografia..."
          />
          <Input
            tone="cine"
            label="Título"
            value={cmsAbout.title ?? ""}
            onChange={(e) => setAt("about.title", e.target.value)}
            placeholder="Eventos reais..."
          />
          <Textarea
            label="Subtítulo"
            value={cmsAbout.subtitle ?? ""}
            onChange={(e) => setAt("about.subtitle", e.target.value)}
            placeholder="A Cineflow registra..."
          />
          <Input
            tone="cine"
            label="Card (título curto)"
            value={cmsAbout.signatureTitle ?? ""}
            onChange={(e) => setAt("about.signatureTitle", e.target.value)}
            placeholder="Assinatura visual"
          />
          <Input
            tone="cine"
            label="Card (subtítulo curto)"
            value={cmsAbout.signatureSubtitle ?? ""}
            onChange={(e) => setAt("about.signatureSubtitle", e.target.value)}
            placeholder="flash • movimento • filme"
          />
        </CardContent>
      </Card>

      <Card className="bg-adminCard/60">
        <CardHeader>
          <p className="text-sm font-semibold text-white/90">Seção 1 (Sobre)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              tone="cine"
              label="Eyebrow"
              value={sectionOne.eyebrow ?? ""}
              onChange={(e) => {
                const next = [...aboutSections];
                next[0] = { ...(next[0] ?? {}), eyebrow: e.target.value };
                setAt("about.sections", next);
              }}
            />
            <Input
              tone="cine"
              label="Título"
              value={sectionOne.title ?? ""}
              onChange={(e) => {
                const next = [...aboutSections];
                next[0] = { ...(next[0] ?? {}), title: e.target.value };
                setAt("about.sections", next);
              }}
            />
            <Input
              tone="cine"
              label="Descrição"
              value={sectionOne.description ?? ""}
              onChange={(e) => {
                const next = [...aboutSections];
                next[0] = { ...(next[0] ?? {}), description: e.target.value };
                setAt("about.sections", next);
              }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(Array.isArray(sectionOne.cards) ? sectionOne.cards : []).map((c: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Input
                  tone="cine"
                  label={`Card ${idx + 1} (título)`}
                  value={c?.title ?? ""}
                  onChange={(e) => {
                    const next = [...aboutSections];
                    const cards = Array.isArray((next[0] ?? {}).cards) ? [...(next[0] ?? {}).cards] : [];
                    cards[idx] = { ...(cards[idx] ?? {}), title: e.target.value };
                    next[0] = { ...(next[0] ?? {}), cards };
                    setAt("about.sections", next);
                  }}
                />
                <Textarea
                  label="Texto"
                  value={c?.desc ?? ""}
                  onChange={(e) => {
                    const next = [...aboutSections];
                    const cards = Array.isArray((next[0] ?? {}).cards) ? [...(next[0] ?? {}).cards] : [];
                    cards[idx] = { ...(cards[idx] ?? {}), desc: e.target.value };
                    next[0] = { ...(next[0] ?? {}), cards };
                    setAt("about.sections", next);
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-adminCard/60">
        <CardHeader>
          <p className="text-sm font-semibold text-white/90">Seção 2 (Método)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              tone="cine"
              label="Eyebrow"
              value={sectionTwo.eyebrow ?? ""}
              onChange={(e) => {
                const next = [...aboutSections];
                next[1] = { ...(next[1] ?? {}), eyebrow: e.target.value };
                setAt("about.sections", next);
              }}
            />
            <Input
              tone="cine"
              label="Título"
              value={sectionTwo.title ?? ""}
              onChange={(e) => {
                const next = [...aboutSections];
                next[1] = { ...(next[1] ?? {}), title: e.target.value };
                setAt("about.sections", next);
              }}
            />
            <Input
              tone="cine"
              label="Descrição"
              value={sectionTwo.description ?? ""}
              onChange={(e) => {
                const next = [...aboutSections];
                next[1] = { ...(next[1] ?? {}), description: e.target.value };
                setAt("about.sections", next);
              }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(Array.isArray(sectionTwo.cards) ? sectionTwo.cards : []).map((c: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Input
                  tone="cine"
                  label={`Card ${idx + 1} (título)`}
                  value={c?.title ?? ""}
                  onChange={(e) => {
                    const next = [...aboutSections];
                    const cards = Array.isArray((next[1] ?? {}).cards) ? [...(next[1] ?? {}).cards] : [];
                    cards[idx] = { ...(cards[idx] ?? {}), title: e.target.value };
                    next[1] = { ...(next[1] ?? {}), cards };
                    setAt("about.sections", next);
                  }}
                />
                <Textarea
                  label="Texto"
                  value={c?.desc ?? ""}
                  onChange={(e) => {
                    const next = [...aboutSections];
                    const cards = Array.isArray((next[1] ?? {}).cards) ? [...(next[1] ?? {}).cards] : [];
                    cards[idx] = { ...(cards[idx] ?? {}), desc: e.target.value };
                    next[1] = { ...(next[1] ?? {}), cards };
                    setAt("about.sections", next);
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-adminCard/60">
        <CardHeader>
          <p className="text-sm font-semibold text-white/90">Footer</p>
          <p className="mt-1 text-xs text-white/55">Texto e contatos.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Textarea
            label="Texto (blurb)"
            value={cmsFooter.blurb ?? ""}
            onChange={(e) => setAt("footer.blurb", e.target.value)}
          />
          <Textarea
            label="Texto de suporte"
            value={cmsFooter.supportText ?? ""}
            onChange={(e) => setAt("footer.supportText", e.target.value)}
          />
          <Input
            tone="cine"
            label="E-mail"
            value={cmsFooter.contactEmail ?? ""}
            onChange={(e) => setAt("footer.contactEmail", e.target.value)}
            placeholder="contato@cineflow.com"
          />
          <Input
            tone="cine"
            label="WhatsApp URL"
            value={cmsFooter.whatsappUrl ?? ""}
            onChange={(e) => setAt("footer.whatsappUrl", e.target.value)}
            placeholder="https://wa.me/..."
          />
          <Input
            tone="cine"
            label="Instagram URL"
            value={cmsFooter.instagramUrl ?? ""}
            onChange={(e) => setAt("footer.instagramUrl", e.target.value)}
            placeholder="https://instagram.com/..."
          />
          <Input
            tone="cine"
            label="Linha pequena (fineprint)"
            value={cmsFooter.fineprint ?? ""}
            onChange={(e) => setAt("footer.fineprint", e.target.value)}
            placeholder="Fotos e vídeos por evento • aftermovies • entrega digital."
          />
        </CardContent>
      </Card>
    </section>
  );
}
