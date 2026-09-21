import type { CreateKitPayload, GeneratedKit, Kit } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function request<T>(
  path: string,
  token: string | null,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (res.status === 204) {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return undefined as T;
  }

  const body = (await res.json().catch(() => ({}))) as {
    error?: string;
  } & T;

  if (!res.ok) {
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return body;
}

export const api = {
  createKit: (token: string | null, payload: CreateKitPayload) =>
    request<Kit>("/kits", token, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listKits: (token: string | null) => request<Kit[]>("/kits", token),

  getKit: (token: string | null, id: string) =>
    request<Kit>(`/kits/${id}`, token),

  deleteKit: (token: string | null, id: string) =>
    request<void>(`/kits/${id}`, token, { method: "DELETE" }),

  patchKit: (
    token: string | null,
    id: string,
    payload: {
      kit?: GeneratedKit;
      practice?: Kit["practice"];
      pinned?: boolean;
    },
  ) =>
    request<Kit>(`/kits/${id}`, token, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
