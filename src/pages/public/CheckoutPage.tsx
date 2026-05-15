import { useSearchParams, Link } from "react-router-dom";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function CheckoutPage() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <main className="cf-container py-16">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FF4655]" />
            Pagamento seguro
          </p>
          <h1 className="mt-5 font-heading text-5xl text-white">Redirecionando para pagamento</h1>
          <p className="mt-4 text-sm text-white/60">{orderId ? `Pedido: ${orderId}` : "Preparando seu pedido…"}</p>
          <p className="mt-2 text-sm text-white/60">Se o redirecionamento não acontecer, volte ao carrinho e tente novamente.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/carrinho">
              <Button tone="light" variant="outline" className="rounded-2xl border-white/15 bg-white/0 text-white hover:bg-white/5 hover:text-white">
                Voltar ao carrinho
              </Button>
            </Link>
            <Link to="/eventos" className="hidden sm:inline-flex">
              <Button tone="light" variant="ghost" className="text-white hover:bg-white/[0.06] hover:text-white">
                Explorar galerias <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

