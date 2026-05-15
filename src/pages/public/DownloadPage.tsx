import { FormEvent, useState } from "react";
import { Download, ShieldCheck } from "lucide-react";
import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";

export function DownloadPage() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!token.trim()) return;
    setStatus("loading");
    try {
      const { data } = await api.get(`/download/${token}`);
      setMessage(`Link válido. Expira em ${new Date(data.expiresAt).toLocaleString("pt-BR")}`);
      window.location.href = `${import.meta.env.VITE_API_URL ?? "http://localhost:3333/api"}/download/${token}/file`;
    } finally {
      setStatus("done");
    }
  }

  return (
    <main className="cf-container py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/80">
            <ShieldCheck className="h-3.5 w-3.5 text-[#FF4655]" />
            Download seguro
          </p>
          <h1 className="mt-4 font-heading text-5xl text-white">Baixar arquivo original</h1>
          <p className="mt-3 text-sm text-white/60">Cole o token do link recebido e confirme para iniciar o download.</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-[2rem] border border-white/10 bg-[#0D0D10] p-5 shadow-[0_28px_120px_rgba(0,0,0,0.55)]">
          <Input tone="cine" label="Token" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Cole o token do link" />
          <div className="mt-4">
            <Button
              tone="light"
              type="submit"
              variant="primary"
              size="lg"
              disabled={status === "loading"}
              fullWidth
              className="rounded-2xl bg-[#FF4655] shadow-[0_18px_50px_rgba(255,70,85,0.20)]"
            >
              <Download className="h-4 w-4" />
              {status === "loading" ? "Validando…" : "Baixar arquivo"}
            </Button>
          </div>
        </form>

        {message ? (
          <div className="mt-4">
            <Badge theme="dark" tone="success">
              {message}
            </Badge>
          </div>
        ) : null}
      </div>
    </main>
  );
}

