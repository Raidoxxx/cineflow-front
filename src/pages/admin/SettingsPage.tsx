import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Image as ImageIcon, Save, UploadCloud } from "lucide-react";
import { api, resolvePublicFileUrl } from "../../services/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

type WatermarkPosition = "CENTER" | "BOTTOM_RIGHT" | "BOTTOM_LEFT" | "TOP_RIGHT" | "TOP_LEFT";

export function SettingsPage() {
  const [companyName, setCompanyName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [watermarkText, setWatermarkText] = useState("PREVIEW");
  const [watermarkImageUrl, setWatermarkImageUrl] = useState("");
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>("CENTER");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.28);

  const [downloadLinkExpirationDays, setDownloadLinkExpirationDays] = useState(7);
  const [emailTemplatePurchaseApproved, setEmailTemplatePurchaseApproved] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingWatermarkImage, setUploadingWatermarkImage] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const logoPreview = useMemo(() => resolvePublicFileUrl(logoUrl), [logoUrl]);
  const watermarkPreview = useMemo(() => resolvePublicFileUrl(watermarkImageUrl), [watermarkImageUrl]);

  useEffect(() => {
    api.get("/admin/settings").then((response) => {
      const s = response.data as any;
      setCompanyName(s.companyName ?? "");
      setLogoUrl(s.logoUrl ?? "");
      setWatermarkText(s.watermarkText ?? "PREVIEW");
      setWatermarkImageUrl(s.watermarkImageUrl ?? "");
      setWatermarkPosition((s.watermarkPosition ?? "CENTER") as WatermarkPosition);
      setWatermarkOpacity(Number(s.watermarkOpacity ?? 0.28));
      setDownloadLinkExpirationDays(Number(s.downloadLinkExpirationDays ?? 7));
      setEmailTemplatePurchaseApproved(s.emailTemplatePurchaseApproved ?? "");
    });
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaved(false);
    setSaving(true);
    try {
      await api.put("/admin/settings", {
        companyName,
        logoUrl: logoUrl || undefined,
        watermarkText,
        watermarkImageUrl: watermarkImageUrl || undefined,
        watermarkPosition,
        watermarkOpacity,
        downloadLinkExpirationDays,
        emailTemplatePurchaseApproved
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function uploadLogo(file: File) {
    setUploadingLogo(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/admin/settings/logo/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      const next = (data?.logoUrl as string | undefined) ?? "";
      setLogoUrl(next);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function uploadWatermarkImage(file: File) {
    setUploadingWatermarkImage(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/admin/settings/watermark-image/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      const next = (data?.watermarkImageUrl as string | undefined) ?? "";
      setWatermarkImageUrl(next);
    } finally {
      setUploadingWatermarkImage(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-24 md:pb-0">
      <PageHeader
        title="Configurações"
        subtitle="Personalize sua empresa, marca d’água, downloads e textos de e-mail."
        actions={
          <div className="flex items-center gap-2">
            {saved ? <Badge tone="success">Salvo</Badge> : null}
            <Button type="submit" variant="primary">
              <Save className="h-4 w-4" />
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        }
      />

      <Card className="bg-adminCard/70">
        <CardHeader>
          <h2 className="font-heading text-2xl text-adminText">Empresa</h2>
          <p className="mt-1 text-sm text-adminTextMuted">Nome e identidade visual exibidos nas páginas públicas.</p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <Input label="Nome da empresa" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Ex.: Cinefllow" />

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white/90">Logo</p>
                <p className="mt-0.5 text-xs text-white/55">Envie uma imagem (PNG/SVG/JPG). Ela aparece no site.</p>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadLogo(f);
                  if (e.currentTarget) e.currentTarget.value = "";
                }}
              />
              <Button type="button" variant="outline" size="sm" className="rounded-2xl" onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo}>
                <UploadCloud className="h-4 w-4" />
                {uploadingLogo ? "Enviando…" : "Enviar logo"}
              </Button>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                {logoPreview ? <img src={logoPreview} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-4 w-4 text-white/55" />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/80">{logoUrl || "Nenhum logo enviado"}</p>
                <p className="mt-0.5 text-xs text-white/55">Dica: fundo transparente funciona melhor.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-adminCard/70">
        <CardHeader>
          <h2 className="font-heading text-2xl text-adminText">Marca d’água</h2>
          <p className="mt-1 text-sm text-adminTextMuted">Configura a proteção e pré-visualização das mídias.</p>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Texto da marca" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} placeholder="PREVIEW" />
            <Input
              label="Opacidade (0 a 1)"
              type="number"
              step="0.01"
              min={0}
              max={1}
              value={watermarkOpacity}
              onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
              hint="Sugestão: 0.20 a 0.35"
            />
            <Select label="Posição" value={watermarkPosition} onChange={(e) => setWatermarkPosition(e.target.value as WatermarkPosition)}>
              <option value="CENTER">Centro</option>
              <option value="BOTTOM_RIGHT">Inferior direita</option>
              <option value="BOTTOM_LEFT">Inferior esquerda</option>
              <option value="TOP_RIGHT">Superior direita</option>
              <option value="TOP_LEFT">Superior esquerda</option>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white/90">Imagem</p>
                <p className="mt-0.5 text-xs text-white/55">Envie uma imagem para usar como marca d’água (opcional).</p>
              </div>
              <input
                ref={watermarkInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadWatermarkImage(f);
                  if (e.currentTarget) e.currentTarget.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-2xl"
                onClick={() => watermarkInputRef.current?.click()}
                disabled={uploadingWatermarkImage}
              >
                <UploadCloud className="h-4 w-4" />
                {uploadingWatermarkImage ? "Enviando…" : "Enviar imagem"}
              </Button>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-3">
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                {watermarkPreview ? <img src={watermarkPreview} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-4 w-4 text-white/55" />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/80">{watermarkImageUrl || "Nenhuma imagem enviada"}</p>
                <p className="mt-0.5 text-xs text-white/55">Dica: PNG com transparência funciona melhor.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-adminCard/70">
        <CardHeader>
          <h2 className="font-heading text-2xl text-adminText">Downloads</h2>
          <p className="mt-1 text-sm text-adminTextMuted">Política de expiração para links de download.</p>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            label="Expiração do link (dias)"
            type="number"
            min={1}
            max={30}
            value={downloadLinkExpirationDays}
            onChange={(e) => setDownloadLinkExpirationDays(Number(e.target.value))}
            hint="Máximo: 30 dias"
          />
        </CardContent>
      </Card>

      <Card className="bg-adminCard/70">
        <CardHeader>
          <h2 className="font-heading text-2xl text-adminText">E-mail</h2>
          <p className="mt-1 text-sm text-adminTextMuted">Texto padrão enviado quando a compra é aprovada.</p>
        </CardHeader>
        <CardContent>
          <Textarea
            label="Template (compra aprovada)"
            value={emailTemplatePurchaseApproved}
            onChange={(e) => setEmailTemplatePurchaseApproved(e.target.value)}
            placeholder="Escreva a mensagem padrão para o cliente…"
            hint="Você pode incluir instruções sobre download, validade e contato."
          />
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-adminBg/85 p-3 backdrop-blur md:hidden">
        <div className="cf-container flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-adminTextMuted">Configurações</p>
            {saved ? <Badge tone="success">Salvo</Badge> : <p className="text-xs text-adminTextMuted">{saving ? "Salvando…" : "Pronto para salvar"}</p>}
          </div>
          <Button type="submit" variant="primary" disabled={saving}>
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>
    </form>
  );
}

