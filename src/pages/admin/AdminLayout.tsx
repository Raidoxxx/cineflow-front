import { Outlet, NavLink } from "react-router-dom";
import { AdminSidebar } from "../../components/admin/AdminSidebar";
import { AdminHeader } from "../../components/admin/AdminHeader";
import { LayoutDashboard, CalendarDays, Receipt, Settings } from "lucide-react";
import { cn } from "../../lib/cn";

const mobileLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/eventos", label: "Eventos", icon: CalendarDays },
  { to: "/admin/pedidos", label: "Pedidos", icon: Receipt },
  { to: "/admin/configuracoes", label: "Config.", icon: Settings }
] as const;

export function AdminLayout() {
  return (
    <div className="admin-shell min-h-screen text-adminText">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="min-w-0 flex-1">
          <AdminHeader />
          <div className="px-4 py-6 md:px-6">
            <Outlet />
          </div>
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-adminBg/80 backdrop-blur md:hidden">
        <div className="grid grid-cols-4">
          {mobileLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold text-adminTextMuted",
                  isActive && "text-adminText"
                )
              }
            >
              <l.icon className="h-5 w-5 text-cfGold/90" />
              {l.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}

