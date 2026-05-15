import { CreditCard, Lock } from "lucide-react";

export function CheckoutSummary({ total }: { total: number }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Resumo do pedido</p>
      <h3 className="mt-1 font-heading text-2xl text-white">Total</h3>
      <p className="mt-3 text-4xl font-black text-white">{`R$ ${total.toFixed(2)}`}</p>

      <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-black/25 p-4">
        <p className="inline-flex items-center gap-2 text-xs text-white/65">
          <CreditCard className="h-3.5 w-3.5 text-[#FF4655]" />
          Pagamento via Mercado Pago Checkout Pro
        </p>
        <p className="inline-flex items-center gap-2 text-xs text-white/65">
          <Lock className="h-3.5 w-3.5 text-[#FF4655]" />
          Transações com segurança e criptografia
        </p>
      </div>
    </div>
  );
}

