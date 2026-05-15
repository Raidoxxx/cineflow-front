import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Link as LinkIcon, RefreshCw } from "lucide-react";
import { api } from "../../services/api";
import { PageHeader } from "../../components/ui/PageHeader";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import type { OrderModel } from "../../types";

export function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderModel | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/admin/orders/${id}`)
      .then((response) => setOrder(response.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading && !order) {
    return <p className="text-adminTextMuted">Carregando…</p>;
  }

  if (!order) {
    return <p className="text-adminTextMuted">Pedido não encontrado.</p>;
  }

  return (
    <section className="space-y-6 pb-20 md:pb-0">
      <PageHeader
        title={`Pedido ${order.id}`}
        subtitle="Ações administrativas e detalhes do cliente."
        actions={
          <Link to="/admin/pedidos">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <Card className="bg-adminCard/70">
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Status</p>
                <div className="mt-2">
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <p className="text-lg font-black text-adminText">{`R$ ${Number(order.totalAmount).toFixed(2)}`}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Cliente</p>
              <p className="mt-2 text-sm font-semibold text-adminText">{order.customerName}</p>
              <p className="mt-1 text-sm text-adminTextMuted">{order.customerEmail}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Itens</p>
              <div className="space-y-2">
                {order.items?.map((it) => (
                  <div key={it.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-adminText">{it.mediaAsset?.title ?? it.mediaAssetId}</p>
                      <p className="mt-0.5 text-xs text-adminTextMuted">{it.mediaAsset?.type ?? "—"}</p>
                    </div>
                    <p className="text-sm font-black text-adminText">{`R$ ${Number(it.price).toFixed(2)}`}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-adminCard/70">
          <CardContent className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Ações</p>
            <Button variant="primary" fullWidth onClick={() => api.post(`/admin/orders/${order.id}/resend-email`)}>
              <Mail className="h-4 w-4" />
              Reenviar e-mail
            </Button>
            <Button variant="secondary" fullWidth onClick={() => api.post(`/admin/orders/${order.id}/generate-download-links`)}>
              <LinkIcon className="h-4 w-4 text-cfGold/90" />
              Gerar novos links
            </Button>
            <Button variant="ghost" fullWidth onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
            <p className="text-xs text-adminTextMuted">Use “Gerar novos links” quando precisar invalidar links anteriores.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

