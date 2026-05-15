import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333/api";

function computeFilesBaseUrl(apiUrl: string) {
  const raw = String(apiUrl ?? "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    // Backend serves `/public-files` at the app root (same origin as API),
    // so for files we only need the origin + optional base path BEFORE `/api`.
    const path = u.pathname.replace(/\/+$/, "");
    const idx = path.toLowerCase().indexOf("/api");
    if (idx === -1) return `${u.origin}${path}`.replace(/\/+$/, "");
    const basePath = path.slice(0, idx);
    return `${u.origin}${basePath}`.replace(/\/+$/, "");
  } catch {
    // Fallback for non-absolute URLs (should be rare in Vite envs)
    return raw.replace(/\/api(\/.*)?$/, "");
  }
}

const FILES_BASE_URL = computeFilesBaseUrl(API_URL);

function computeApiBaseUrl(apiUrl: string) {
  const raw = String(apiUrl ?? "").trim();
  if (!raw) return "";
  try {
    const u = new URL(raw);
    return `${u.origin}${u.pathname}`.replace(/\/+$/, "");
  } catch {
    return raw.replace(/\/+$/, "");
  }
}

const API_BASE_URL = computeApiBaseUrl(API_URL);

export const api = axios.create({
  baseURL: API_URL
});

export function resolvePublicFileUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return "";
  const value = String(pathOrUrl).trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/public-files/")) {
    // Files are served at the app root (same origin as API), so we must NOT include `/api` here.
    // `FILES_BASE_URL` strips `/api` when API_URL is like `https://site.com/api`.
    return `${FILES_BASE_URL}${value}`;
  }
  if (value.startsWith("public/")) return `${FILES_BASE_URL}/public-files/${value.replace(/^public\//, "")}`;
  return value;
}

export function resolveAlternatePublicFileUrl(pathOrUrl?: string) {
  if (!pathOrUrl) return "";
  const value = String(pathOrUrl).trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  // Toggle between `/public-files/*` and `/api/public-files/*` to support different reverse proxy setups.
  if (value.startsWith("/public-files/")) return `${FILES_BASE_URL}${value}`;
  if (value.startsWith("public/")) return `${FILES_BASE_URL}/public-files/${value.replace(/^public\//, "")}`;
  return value;
}

export function setAuthToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
