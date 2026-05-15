import { Badge } from "./Badge";
import type { OrderModel } from "../../types";

export function StatusBadge({ status }: { status: OrderModel["status"] }) {
  if (status === "PAID") return <Badge tone="success">Pago</Badge>;
  if (status === "PENDING") return <Badge tone="info">Pendente</Badge>;
  if (status === "CANCELLED") return <Badge tone="danger">Cancelado</Badge>;
  if (status === "EXPIRED") return <Badge tone="neutral">Expirado</Badge>;
  if (status === "REFUNDED") return <Badge tone="neutral">Reembolsado</Badge>;
  return <Badge tone="neutral">{status}</Badge>;
}

