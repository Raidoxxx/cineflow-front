import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/public/HomePage";
import { EventsBrowsePage } from "../pages/public/EventsBrowsePage";
import { EventPage } from "../pages/public/EventPage";
import { CartPage } from "../pages/public/CartPage";
import { CheckoutPage } from "../pages/public/CheckoutPage";
import { SuccessPage } from "../pages/public/SuccessPage";
import { DownloadPage } from "../pages/public/DownloadPage";
import { AboutPage } from "../pages/public/AboutPage";
import { LoginPage } from "../pages/admin/LoginPage";
import { AdminLayout } from "../pages/admin/AdminLayout";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { EventsPage } from "../pages/admin/EventsPage";
import { EventFormPage } from "../pages/admin/EventFormPage";
import { EventDetailsPage } from "../pages/admin/EventDetailsPage";
import { OrdersPage } from "../pages/admin/OrdersPage";
import { OrderDetailsPage } from "../pages/admin/OrderDetailsPage";
import { SettingsPage } from "../pages/admin/SettingsPage";
import { PublicContentPage } from "../pages/admin/PublicContentPage";
import { useAuth } from "../hooks/use-auth";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  if (!auth.token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sobre" element={<AboutPage />} />
      <Route path="/eventos" element={<EventsBrowsePage />} />
      <Route path="/eventos/:slug" element={<EventPage />} />
      <Route path="/carrinho" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/sucesso" element={<SuccessPage />} />
      <Route path="/download/:token" element={<DownloadPage />} />
      <Route path="/downloads" element={<DownloadPage />} />

      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="eventos" element={<EventsPage />} />
        <Route path="eventos/novo" element={<EventFormPage />} />
        <Route path="eventos/:id" element={<EventDetailsPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="pedidos/:id" element={<OrderDetailsPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
        <Route path="conteudo" element={<PublicContentPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
