import type { Kit } from "./types";

export function kitTitle(kit: Kit) {
  return (
    kit.kit?.companyBrief.name ??
    kit.input.companyName ??
    "Untitled company"
  );
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
