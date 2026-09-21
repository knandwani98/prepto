import type { CreateKitPayload } from "./types";

const KEY = "prepto:draft";

function emptyDraft(): CreateKitPayload {
  return {
    jobDescription: "",
    companyUrl: "",
    daysUntilInterview: 7,
    companyName: "",
  };
}

function normalize(value: Partial<CreateKitPayload> | null | undefined): CreateKitPayload {
  const days = Number(value?.daysUntilInterview);
  return {
    jobDescription: String(value?.jobDescription ?? ""),
    companyUrl: String(value?.companyUrl ?? ""),
    daysUntilInterview: Number.isFinite(days) && days > 0 ? days : 7,
    companyName: value?.companyName ? String(value.companyName) : "",
  };
}

export function hasKitDraftContent(payload: Partial<CreateKitPayload> | null | undefined) {
  if (!payload) return false;
  return Boolean(
    payload.jobDescription?.trim() ||
      payload.companyUrl?.trim() ||
      payload.companyName?.trim(),
  );
}

export function saveKitDraft(payload: CreateKitPayload) {
  if (typeof window === "undefined") return;
  try {
    if (!hasKitDraftContent(payload)) {
      localStorage.removeItem(KEY);
      return;
    }
    localStorage.setItem(KEY, JSON.stringify(normalize(payload)));
  } catch {
    // Private mode can throw.
  }
}

export function readKitDraft(): CreateKitPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CreateKitPayload>;
    const draft = normalize(parsed);
    return hasKitDraftContent(draft) ? draft : null;
  } catch {
    return null;
  }
}

export function clearKitDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Private mode can throw.
  }
}

export { emptyDraft };
