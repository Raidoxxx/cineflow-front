import { Link, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../hooks/use-cart";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { api, resolvePublicFileUrl } from "../../services/api";

export function PublicNavbar() {
  const location = useLocation();
  const cart = useCart();
  const [open, setOpen] = useState(false);
  const count = cart.items.length;
  const [brand, setBrand] = useState<{ companyName?: string; logoUrl?: string; publicContent?: any }>({});

  const cartLabel = useMemo(() => (count === 1 ? "1 item" : `${count} itens`), [count]);

  const isHashActive = (to: string) => {
    if (!to.includes("#")) return false;
    const [path, hash] = to.split("#");
    return location.pathname === path && location.hash === `#${hash}`;
  };

  useEffect(() => {
    api
      .get("/public/settings")
      .then((r) => setBrand(r.data ?? {}))
      .catch(() => undefined);
  }, []);

  const logo = useMemo(() => resolvePublicFileUrl(brand.logoUrl), [brand.logoUrl]);
  const companyName = brand.companyName?.trim() || "Cineflow";
  const cmsNavbar = brand.publicContent?.navbar ?? {};
  const navLinks = useMemo(
    () => [
      { to: "/sobre", label: cmsNavbar.aboutLabel ?? "A Cineflow" },
      { to: "/eventos", label: cmsNavbar.galleriesLabel ?? "Galerias" }
    ],
    [cmsNavbar.aboutLabel, cmsNavbar.galleriesLabel]
  );

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08090B]/80 backdrop-blur">
      <div className="cf-container flex h-16 items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-soft">
            {logo ? (
              <img src={logo} alt={companyName} className="h-full w-full object-cover" />
            ) : (
              <span className="font-heading text-lg text-white">{companyName.slice(0, 1).toUpperCase()}</span>
            )}
          </div>
          <div className="leading-tight">
            <p className="font-heading text-xl text-white">{companyName}</p>
            <p className="text-xs text-white/55">{cmsNavbar.tagline ?? "Produtora • Foto • Vídeo"}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white",
                isHashActive(l.to) && "bg-white/[0.06] text-white"
              )}
            >
              {l.label}
            </Link>
          ))}

          <NavLink
            to="/eventos"
            className={({ isActive }) =>
              cn(
                "rounded-full px-4 py-2 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] hover:text-white",
                isActive && "bg-white/[0.06] text-white"
              )
            }
          >
            Eventos
          </NavLink>

          <Link
            to="/carrinho"
            className="relative ml-1 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/[0.06] hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" />
            Carrinho
            {count ? <span className="ml-1 inline-flex items-center rounded-full bg-[#FF4655] px-2 py-0.5 text-xs font-black text-white">{count}</span> : null}
          </Link>

          <Link to="/eventos#buscar">
            <Button tone="light" variant="primary" size="sm" className="rounded-full bg-[#FF4655] shadow-[0_18px_50px_rgba(255,70,85,0.20)]">
              <Search className="h-4 w-4" />
              Encontrar meu evento
            </Button>
          </Link>

          <Link
            to="/admin/login"
            className="ml-1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/75 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            aria-label="Acesso administrativo"
          >
            <LayoutDashboard className="h-4 w-4 text-white/70" />
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Link to="/carrinho" className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <ShoppingBag className="h-5 w-5 text-white/85" />
            {count ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#FF4655] px-1 text-[10px] font-black text-white">
                {count}
              </span>
            ) : null}
            <span className="sr-only">{`Abrir carrinho, ${cartLabel}`}</span>
          </Link>
          <Button tone="light" variant="ghost" className="h-10 w-10 rounded-2xl p-0 text-white" onClick={() => setOpen((v) => !v)} aria-label="Abrir menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[#0D0D10]/95 backdrop-blur md:hidden">
          <div className="cf-container py-4">
            <div className="grid gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80"
                >
                  {l.label}
                </Link>
              ))}

              <Link
                to="/eventos#buscar"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80"
              >
                <span className="inline-flex items-center gap-2">
                  <Search className="h-4 w-4 text-white/70" />
                  Encontrar meu evento
                </span>
              </Link>

              <Link
                to="/admin/login"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/80"
              >
                <span className="inline-flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4 text-white/70" />
                  Acesso administrativo
                </span>
                <span className="text-xs text-white/50">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
