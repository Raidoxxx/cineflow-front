import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Receipt, Settings, Clapperboard, Type } from "lucide-react";
import { cn } from "../../lib/cn";

const links = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { to: "/admin/pedidos", label: "Pedidos", icon: Receipt },
  { to: "/admin/conteudo", label: "Conteúdo", icon: Type },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings }
] as const;

export function AdminSidebar() {
  return (
    <aside className="hidden w-72 border-r border-white/10 bg-adminSidebar md:block">
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Clapperboard className="h-5 w-5 text-cfGold" />
          </div>
          <div>
            <p className="font-heading text-2xl text-adminText">Cinefllow</p>
            <p className="text-xs text-adminTextMuted">Admin</p>
          </div>
        </div>
      </div>

      <nav className="px-4 pb-6">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Menu</p>
        <div className="space-y-1.5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm font-semibold text-adminText/75 transition hover:bg-white/[0.04] hover:text-adminText",
                  isActive && "border-cfGold/25 bg-cfGold/10 text-adminText"
                )
              }
            >
              <l.icon className="h-4.5 w-4.5 text-cfGold/90" />
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

