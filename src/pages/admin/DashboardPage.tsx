import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Camera, CreditCard, Clock, Sparkles } from "lucide-react";
import { api } from "../../services/api";
import { StatCard } from "../../components/admin/StatCard";
import { DataTable } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { EmptyState } from "../../components/ui/EmptyState";

type DashboardStats = {
  totalEvents: number;
  totalMedia: number;
  soldAmount: number;
  paidOrders: number;
  pendingOrders: number;
  expiringSoonMedia: number;
  latestOrders: Array<{
    id: string;
    status: "PENDING" | "PAID" | "CANCELLED" | "EXPIRED" | "REFUNDED";
    customerName: string;
    totalAmount: number;
    createdAt: string;
    event?: { title: string; slug: string };
  }>;
};

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/dashboard")
      .then((response) => setStats(response.data))
      .finally(() => setLoading(false));
  }, []);

  const sold = useMemo(() => (stats ? `R$ ${Number(stats.soldAmount).toFixed(2)}` : "—"), [stats]);

  return (
    <section className="space-y-8 pb-20 md:pb-0">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total de eventos" value={stats?.totalEvents ?? "—"} icon={CalendarDays} hint="Galerias criadas" />
        <StatCard title="Total de mídias" value={stats?.totalMedia ?? "—"} icon={Camera} hint="Fotos e vídeos" />
        <StatCard title="Total vendido" value={sold} icon={CreditCard} hint="Somente pedidos pagos" />
        <StatCard title="Pedidos pagos" value={stats?.paidOrders ?? "—"} icon={Sparkles} />
        <StatCard title="Pedidos pendentes" value={stats?.pendingOrders ?? "—"} icon={Clock} />
        <StatCard title="Mídias expirando" value={stats?.expiringSoonMedia ?? "—"} icon={Clock} hint="Próximos 7 dias" />
      </div>

      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Atividade</p>
            <h2 className="mt-1 font-heading text-3xl text-adminText">Últimos pedidos</h2>
          </div>
          <Link to="/admin/pedidos" className="text-sm font-semibold text-cfGold hover:underline">
            Ver todos
          </Link>
        </div>

        {!stats?.latestOrders?.length && !loading ? (
          <EmptyState title="Nenhum pedido encontrado" description="Quando houver compras, os pedidos mais recentes aparecerão aqui." />
        ) : (
          <DataTable
            columns={
              <>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Evento</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </>
            }
          >
            {(stats?.latestOrders ?? []).map((o) => (
              <tr key={o.id} className="hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-mono text-xs text-white/80">{o.id}</td>
                <td className="px-4 py-3 text-white/80">{o.event?.title ?? "—"}</td>
                <td className="px-4 py-3 text-white/80">{o.customerName}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3 font-semibold text-white">{`R$ ${Number(o.totalAmount).toFixed(2)}`}</td>
                <td className="px-4 py-3 text-right">
                  <Link className="text-sm font-semibold text-cfGold hover:underline" to={`/admin/pedidos/${o.id}`}>
                    Detalhes
                  </Link>
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </div>
    </section>
  );
}

