import type { Kit, KitListItem } from "./types";

export const KIT_CREATED_EVENT = "prepto:kit-created";

export function toKitListItem(kit: Kit): KitListItem {
  return {
    id: kit.id,
    status: kit.status,
    pinnedAt: kit.pinnedAt ?? null,
    createdAt: kit.createdAt,
    companyName: kit.kit?.companyBrief.name ?? kit.input.companyName ?? null,
    roleTitle: kit.kit?.roleBreakdown.title ?? null,
  };
}

export function kitTitle(kit: Kit | KitListItem) {
  if ("input" in kit) {
    return (
      kit.kit?.companyBrief.name ??
      kit.input.companyName ??
      "Untitled company"
    );
  }
  return kit.companyName ?? "Untitled company";
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function statusLabel(status: string) {
  switch (status) {
    case "queued":
      return "Queued";
    case "researching":
      return "Researching";
    case "generating":
      return "Generating";
    case "ready":
      return "Ready";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}
