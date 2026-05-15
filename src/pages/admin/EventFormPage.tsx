import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../../services/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";

export function EventFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [defaultPhotoPrice, setDefaultPhotoPrice] = useState(15);
  const [defaultVideoPrice, setDefaultVideoPrice] = useState(30);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/events", {
        title,
        description,
        eventDate,
        expiresAt,
        isPublic: true,
        isActive: true,
        defaultPhotoPrice,
        defaultVideoPrice
      });
      navigate("/admin/eventos");
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

      <Card className="bg-adminCard/70">
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input required label="Título" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Casamento Ana & João" />
          <Input label="Data do evento" type="datetime-local" required value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          <Input label="Expiração da galeria" type="datetime-local" required value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} hint="Após expirar, mídias não ficam disponíveis para venda." />
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

