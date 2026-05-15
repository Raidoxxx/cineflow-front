import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/Button";

function titleFromPath(pathname: string) {
  if (pathname.includes("/admin/eventos")) return "Eventos";
  if (pathname.includes("/admin/pedidos")) return "Pedidos";
  if (pathname.includes("/admin/configuracoes")) return "Configurações";
  return "Dashboard";
}

export function AdminTopbar() {
  const auth = useAuth();
  const location = useLocation();
  const title = useMemo(() => titleFromPath(location.pathname), [location.pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-adminBg/70 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <LayoutDashboard className="h-5 w-5 text-cfGold" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Painel</p>
            <h1 className="font-heading text-2xl text-adminText">{title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="hidden rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-adminText/80 hover:border-cfGold/30 hover:bg-cfGold/10 hover:text-adminText md:inline-flex"
          >
            Ver site
          </Link>
          <Button variant="primary" className="rounded-full" onClick={auth.logout}>
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

