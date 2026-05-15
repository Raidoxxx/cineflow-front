import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, LockKeyhole, ArrowLeft } from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export function LoginPage() {
  const [email, setEmail] = useState("admin@cineflow.local");
  const [password, setPassword] = useState("Admin@123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      auth.login(data.token);
      navigate("/admin/dashboard");
    } catch {
      setError("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-shell relative grid min-h-screen place-items-center overflow-hidden p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_0%,rgba(255,70,85,0.14),transparent_45%),radial-gradient(900px_circle_at_80%_35%,rgba(255,255,255,0.06),transparent_55%),linear-gradient(to_bottom,rgba(11,13,16,0.55),rgba(11,13,16,0.92))]" />

      <div className="relative w-full max-w-md">
        <Link to="/" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-adminText/70 hover:text-adminText">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao site
        </Link>

        <form onSubmit={onSubmit} className="rounded-3xl border border-white/10 bg-adminCard/70 p-6 shadow-card backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-cfGold">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-adminTextMuted">Cinefllow</p>
              <h1 className="mt-1 font-heading text-3xl text-adminText">Acesso administrativo</h1>
            </div>
          </div>

          <p className="mt-4 text-sm text-adminTextMuted">Entre com suas credenciais para gerenciar eventos, mídias e pedidos.</p>

          <div className="mt-6 space-y-4">
            <Input label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@cineflow.local" />
            <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Sua senha" />
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-2xl border border-white/10 bg-black/25 p-3 text-xs text-adminTextMuted">
            <ShieldCheck className="h-4 w-4 text-cfGold/90" />
            Sessão protegida. Seu token é armazenado localmente apenas para autenticação.
          </div>
        </form>
      </div>
    </main>
  );
}

