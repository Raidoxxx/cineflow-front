import { FormEvent, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../../services/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateTimeLocalValue(date: Date) {
  // `datetime-local` expects local time without timezone (YYYY-MM-DDTHH:mm).
  const d = new Date(date);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toIsoOrThrow(value: string, fieldLabel: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error(`Data invÃ¡lida: ${fieldLabel}`);
  return d.toISOString();
}

export function EventFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(() => toDateTimeLocalValue(new Date()));
  const [expiresAt, setExpiresAt] = useState(() => toDateTimeLocalValue(addDays(endOfDay(new Date()), 30)));
  const [defaultPhotoPrice, setDefaultPhotoPrice] = useState(15);
  const [defaultVideoPrice, setDefaultVideoPrice] = useState(30);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const expiresHint = useMemo(() => {
    const d = new Date(expiresAt);
    if (Number.isNaN(d.getTime())) return "Após expirar, mídias não ficam disponíveis para venda.";
    return `Após expirar, mídias não ficam disponíveis para venda. Sugestão: deixe pelo menos até ${d.toLocaleDateString("pt-BR")}.`;
  }, [expiresAt]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const eventDateIso = toIsoOrThrow(eventDate, "Data do evento");
      const expiresAtIso = toIsoOrThrow(expiresAt, "Expiração da galeria");

      const now = Date.now();
      if (new Date(expiresAtIso).getTime() <= now) {
        setError("A expiração precisa ser uma data/hora no futuro.");
        return;
      }
      if (new Date(expiresAtIso).getTime() <= new Date(eventDateIso).getTime()) {
        setError("A expiração precisa ser depois da data do evento.");
        return;
      }

      await api.post("/admin/events", {
        title,
        description,
        eventDate: eventDateIso,
        expiresAt: expiresAtIso,
        isPublic: true,
        isActive: true,
        defaultPhotoPrice,
        defaultVideoPrice
      });
      navigate("/admin/eventos");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível criar o evento.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 pb-20 md:pb-0">
      <PageHeader
        title="Novo evento"
        subtitle="Crie uma nova galeria e defina data, validade e preços padrão."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/eventos">
              <Button variant="secondary">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <Button type="submit" variant="primary">
              <Save className="h-4 w-4" />
              {saving ? "Salvando…" : "Salvar"}
            </Button>
          </div>
        }
      />

      {error ? (
        <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <Card className="bg-adminCard/70">
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input required label="Título" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Casamento Ana & João" />
          <Input label="Data do evento" type="datetime-local" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          <Input label="Expiração da galeria" type="datetime-local" required value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} hint={expiresHint} />
          <div className="grid gap-4 md:grid-cols-2 md:col-span-2">
            <Input label="Preço padrão (foto)" type="number" required value={defaultPhotoPrice} onChange={(e) => setDefaultPhotoPrice(Number(e.target.value))} />
            <Input label="Preço padrão (vídeo)" type="number" required value={defaultVideoPrice} onChange={(e) => setDefaultVideoPrice(Number(e.target.value))} />
          </div>
          <div className="md:col-span-2">
            <Textarea label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Informações do evento, fotógrafo, instruções…" />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
