import { createContext, useContext, useMemo, useState } from "react";
import { setAuthToken } from "../services/api";

interface AuthState {
  token?: string;
  role?: "ADMIN" | "PHOTOGRAPHER";
  email?: string;
}

interface AuthContextValue extends AuthState {
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ token: localStorage.getItem("adminToken") ?? undefined });

  useMemo(() => {
    setAuthToken(state.token);
  }, [state.token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login: (token) => {
        localStorage.setItem("adminToken", token);
        setAuthToken(token);
        setState({ token });
      },
      logout: () => {
        localStorage.removeItem("adminToken");
        setAuthToken(undefined);
        setState({});
      }
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
