import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";

export function SuccessPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const [status, setStatus] = useState<string>("PENDING");

  useEffect(() => {
    if (!orderId) return;
    api.get(`/public/orders/${orderId}/status`).then((response) => {
      setStatus(response.data.status);
    });
  }, [orderId]);

  const paid = status === "PAID";

  return (
    <main className="cf-container py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-3xl border border-white/10 bg-black/25 text-white/90">
            {paid ? <CheckCircle2 className="h-6 w-6 text-emerald-300" /> : <Clock className="h-6 w-6 text-white/75" />}
          </div>
          <h1 className="mt-5 font-heading text-5xl text-white">{paid ? "Pagamento confirmado" : "Pagamento em processamento"}</h1>
          <p className="mt-3 text-sm text-white/60">{orderId ? `Pedido: ${orderId}` : null}</p>

          <div className="mt-6 flex justify-center">
            {paid ? <Badge theme="dark" tone="success">Pago</Badge> : <Badge theme="dark" tone="info">Pendente</Badge>}
          </div>

          <p className="mt-4 text-sm text-white/60">Após aprovação via webhook, os links serão enviados por e-mail.</p>
          <p className="mt-2 inline-flex items-center justify-center gap-2 text-xs text-white/65">
            <Mail className="h-3.5 w-3.5 text-[#FF4655]" />
            Entrega por e-mail com links de download
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/eventos">
              <Button tone="light" variant="outline" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
                Voltar para galerias
              </Button>
            </Link>
            {paid && orderId ? (
              <Link to={`/downloads?orderId=${orderId}`}>
                <Button tone="light" variant="primary" className="rounded-2xl bg-[#FF4655]">
                  Acessar downloads
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

