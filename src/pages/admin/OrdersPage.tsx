import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { api } from "../../services/api";
import { OrdersTable } from "../../components/admin/OrdersTable";
import { OrderModel } from "../../types";
import { PageHeader } from "../../components/ui/PageHeader";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";

type OrderStatus = OrderModel["status"] | "ALL";

export function OrdersPage() {
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [status, setStatus] = useState<OrderStatus>("ALL");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api.get("/admin/orders").then((response) => setOrders(response.data));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "ALL" && o.status !== status) return false;
      if (!q) return true;
      return [o.id, o.customerName, o.customerEmail].some((t) => String(t).toLowerCase().includes(q));
    });
  }, [orders, query, status]);

  return (
    <section className="space-y-6 pb-20 md:pb-0">
      <PageHeader title="Pedidos" subtitle="Acompanhe status, valores e ações de entrega." />

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <Input
          label="Buscar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por pedido, cliente ou e-mail…"
          startAdornment={<Search className="h-4 w-4" />}
        />
        <div className="flex flex-wrap gap-2">
          {(["ALL", "PENDING", "PAID", "CANCELLED", "EXPIRED", "REFUNDED"] as const).map((s) => (
            <Button key={s} variant={status === s ? "primary" : "secondary"} size="sm" className="rounded-full" onClick={() => setStatus(s)}>
              {s === "ALL" ? "Todos" : s === "PENDING" ? "Pendente" : s === "PAID" ? "Pago" : s === "CANCELLED" ? "Cancelado" : s === "EXPIRED" ? "Expirado" : "Reembolsado"}
            </Button>
          ))}
        </div>
      </div>

      {!filtered.length ? <EmptyState title="Nenhum pedido encontrado" description="Ajuste filtros ou aguarde novas compras." /> : <OrdersTable orders={filtered} />}
    </section>
  );
}

