import { Link } from "react-router-dom";
import { OrderModel } from "../../types";
import { DataTable } from "../ui/DataTable";
import { StatusBadge } from "../ui/StatusBadge";

export function OrdersTable({ orders }: { orders: OrderModel[] }) {
  return (
    <DataTable
      columns={
        <>
          <th className="px-4 py-3">Pedido</th>
          <th className="px-4 py-3">Cliente</th>
          <th className="px-4 py-3">Status</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3 text-right">Ações</th>
        </>
      }
    >
      {orders.map((order) => (
        <tr key={order.id} className="hover:bg-white/[0.03]">
          <td className="px-4 py-3 font-mono text-xs text-white/80">{order.id}</td>
          <td className="px-4 py-3 text-white/80">
            <p className="font-semibold text-white">{order.customerName}</p>
            <p className="mt-0.5 text-xs text-white/55">{order.customerEmail}</p>
          </td>
          <td className="px-4 py-3">
            <StatusBadge status={order.status} />
          </td>
          <td className="px-4 py-3 font-semibold text-white">{`R$ ${Number(order.totalAmount).toFixed(2)}`}</td>
          <td className="px-4 py-3 text-right">
            <Link className="text-sm font-semibold text-cfGold hover:underline" to={`/admin/pedidos/${order.id}`}>
              Detalhes
            </Link>
          </td>
        </tr>
      ))}
    </DataTable>
  );
}

