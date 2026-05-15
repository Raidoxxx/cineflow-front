import { FormEvent, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, Mail, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../../hooks/use-cart";
import { CheckoutSummary } from "../../components/public/CheckoutSummary";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { EmptyState } from "../../components/ui/EmptyState";

function thumbFromItem(item: { thumbnailPath?: string }) {
  if (!item.thumbnailPath) return undefined;
  return `/public-files/${item.thumbnailPath.replace("public/", "")}`;
}

export function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [eventId, setEventId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const derivedEventId = useMemo(() => eventId || cart.items[0]?.eventId || "", [eventId, cart.items]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!cart.items.length) return;

    setSubmitting(true);
    try {
      const orderRes = await api.post("/public/orders", {
        eventId: derivedEventId,
        customerName,
        customerEmail,
        customerPhone,
        mediaAssetIds: cart.items.map((item) => item.id)
      });

      const orderId = orderRes.data.id as string;
      const prefRes = await api.post("/payments/mercadopago/create-preference", { orderId });
      const initPoint = prefRes.data.init_point as string;

      navigate(`/checkout?orderId=${orderId}`);
      window.location.href = initPoint;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="cf-container py-10">
      <div className="mb-6">
        <h1 className="font-heading text-4xl text-white md:text-5xl">Carrinho</h1>
        <p className="mt-2 text-sm text-white/60">Revise seus itens, informe seus dados e finalize o pagamento com segurança.</p>
      </div>

      {!cart.items.length ? (
        <div className="max-w-2xl">
          <EmptyState
            title="Seu carrinho está vazio"
            description="Volte para a galeria do seu evento e adicione as mídias que deseja comprar."
            icon={<ShoppingBag className="h-5 w-5" />}
            actionLabel="Ver galerias"
            onAction={() => navigate("/eventos")}
            className="border-white/10 bg-white/[0.04]"
          />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Itens</p>
                  <h2 className="mt-1 font-heading text-2xl text-white">Selecionados</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-semibold text-white/70">{`${cart.items.length} itens`}</span>
              </div>

              <div className="mt-5 space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-3">
                    <div className="h-12 w-14 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                      {thumbFromItem(item) ? (
                        <img className="h-full w-full object-cover" src={thumbFromItem(item)} alt={item.title} />
                      ) : (
                        <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,70,85,0.22),transparent_55%)]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/55">{item.type === "VIDEO" ? "Vídeo" : "Foto"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-black text-white">{`R$ ${Number(item.price).toFixed(2)}`}</p>
                      <Button tone="light" variant="ghost" className="h-9 w-9 rounded-xl p-0 text-white" onClick={() => cart.removeItem(item.id)} aria-label="Remover item">
                        <Trash2 className="h-4 w-4 text-[#FF4655]" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-[#0D0D10] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Dados</p>
              <h2 className="mt-1 font-heading text-2xl text-white">Informações do cliente</h2>
              <p className="mt-2 text-sm text-white/60">Os links de download serão enviados para o e-mail informado após a confirmação do pagamento.</p>

              <div className="mt-6 grid gap-4">
                <Input
                  tone="cine"
                  label="ID do evento (opcional)"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  placeholder="Se não preencher, usamos o evento do primeiro item"
                  hint={derivedEventId ? `Evento selecionado: ${derivedEventId}` : "Preencha apenas se necessário"}
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input tone="cine" required label="Nome" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Seu nome completo" />
                  <Input
                    tone="cine"
                    required
                    type="email"
                    label="E-mail"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="voce@email.com"
                  />
                </div>
                <Input tone="cine" label="Telefone (opcional)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="(11) 99999-9999" />
              </div>

              <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="inline-flex items-center gap-2 text-xs text-white/60">
                  <Mail className="h-3.5 w-3.5 text-white/70" />
                  Entrega por e-mail após aprovação do pagamento
                </p>
                <Button
                  tone="light"
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={submitting}
                  className="rounded-2xl bg-[#FF4655] shadow-[0_18px_50px_rgba(255,70,85,0.20)]"
                >
                  <CreditCard className="h-4 w-4" />
                  {submitting ? "Processando…" : "Pagar com Mercado Pago"}
                </Button>
              </div>
            </form>
          </section>

          <aside className="lg:sticky lg:top-20 lg:self-start">
            <CheckoutSummary total={cart.total} />
            <div className="mt-3 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-xs text-white/60">
              Ao finalizar, você será redirecionado para o checkout do Mercado Pago. Em caso de dúvidas, entre em contato com a empresa responsável pelo evento.
              <div className="mt-2">
                <Link to="/eventos" className="font-semibold text-white/80 hover:text-white">
                  Voltar para galerias
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

