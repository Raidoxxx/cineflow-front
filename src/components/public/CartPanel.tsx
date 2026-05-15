import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../../hooks/use-cart";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";

function thumbFromItem(item: { thumbnailPath?: string }) {
  if (!item.thumbnailPath) return undefined;
  return `/public-files/${item.thumbnailPath.replace("public/", "")}`;
}

function CartItems() {
  const cart = useCart();
  const items = cart.items;

  if (!items.length) {
    return (
      <EmptyState
        title="Seu carrinho está vazio"
        description="Adicione fotos e vídeos da galeria para finalizar sua compra."
        icon={<ShoppingBag className="h-5 w-5" />}
        className="border-white/10 bg-white/[0.04]"
      />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
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
            <p className="text-sm font-bold text-white">{`R$ ${Number(item.price).toFixed(2)}`}</p>
            <Button tone="light" variant="ghost" className="h-9 w-9 rounded-xl p-0 text-white" onClick={() => cart.removeItem(item.id)} aria-label="Remover item">
              <Trash2 className="h-4 w-4 text-[#FF4655]" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartPanel({ title = "Carrinho", showCheckoutButton = true }: { title?: string; showCheckoutButton?: boolean }) {
  const cart = useCart();
  const total = useMemo(() => cart.total, [cart.total]);

  return (
    <aside className="sticky top-20 self-start rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Resumo</p>
          <h3 className="mt-1 font-heading text-2xl text-white">{title}</h3>
        </div>
        <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-xs font-semibold text-white/70">{`${cart.items.length} itens`}</span>
      </div>

      <div className="mt-5">
        <CartItems />
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/70">Subtotal</p>
          <p className="text-lg font-black text-white">{`R$ ${total.toFixed(2)}`}</p>
        </div>
        <p className="mt-2 inline-flex items-center gap-2 text-xs text-white/60">
          <CreditCard className="h-3.5 w-3.5 text-[#FF4655]" />
          Pagamento seguro via Mercado Pago
        </p>
      </div>

      {showCheckoutButton ? (
        <div className="mt-4 space-y-2">
          <Link to="/carrinho" className="block">
            <Button tone="light" variant="primary" fullWidth disabled={!cart.items.length} className="rounded-2xl bg-[#FF4655]">
              Finalizar compra
            </Button>
          </Link>
          <p className="text-xs text-white/45">Links de download são enviados por e-mail após aprovação do pagamento.</p>
        </div>
      ) : null}
    </aside>
  );
}

export function MobileCartBar() {
  const cart = useCart();
  const [open, setOpen] = useState(false);

  if (!cart.items.length) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#08090B]/80 p-3 backdrop-blur lg:hidden">
        <div className="cf-container flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-white/55">{`${cart.items.length} itens no carrinho`}</p>
            <p className="text-base font-black text-white">{`R$ ${cart.total.toFixed(2)}`}</p>
          </div>
          <Button tone="light" variant="primary" onClick={() => setOpen(true)} className="rounded-2xl bg-[#FF4655]">
            Ver carrinho
          </Button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-3xl border border-white/10 bg-[#0D0D10] p-4 shadow-[0_30px_120px_rgba(0,0,0,0.65)]">
            <div className="cf-container">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Carrinho</p>
                  <p className="mt-1 font-heading text-2xl text-white">Resumo</p>
                </div>
                <Button tone="light" variant="ghost" className="h-10 w-10 rounded-2xl p-0 text-white" onClick={() => setOpen(false)} aria-label="Fechar">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <CartItems />
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/70">Subtotal</p>
                  <p className="text-lg font-black text-white">{`R$ ${cart.total.toFixed(2)}`}</p>
                </div>
                <p className="mt-2 inline-flex items-center gap-2 text-xs text-white/60">
                  <CreditCard className="h-3.5 w-3.5 text-[#FF4655]" />
                  Pagamento seguro via Mercado Pago
                </p>
              </div>
              <div className="mt-4">
                <Link to="/carrinho" onClick={() => setOpen(false)} className="block">
                  <Button tone="light" variant="primary" fullWidth className="rounded-2xl bg-[#FF4655]">
                    Finalizar compra
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

