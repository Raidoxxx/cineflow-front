import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

export function usePublicContent() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    api
      .get("/public/settings")
      .then((r) => {
        if (!alive) return;
        setData(r.data?.publicContent ?? null);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const content = useMemo(() => (data ?? {}) as any, [data]);
  return { content, loading };
}

