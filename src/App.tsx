import { AppRoutes } from "./routes/AppRoutes";
import { useLocation } from "react-router-dom";
import { PublicNavbar } from "./components/public/PublicNavbar";
import { PublicFooter } from "./components/public/PublicFooter";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className={isAdminRoute ? "admin-shell min-h-screen text-white" : "min-h-screen bg-[#08090B] text-white"}>
      {isAdminRoute ? null : <PublicNavbar />}
      <AppRoutes />
      {isAdminRoute ? null : <PublicFooter />}
    </div>
  );
}
