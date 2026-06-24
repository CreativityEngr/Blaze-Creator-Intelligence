import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: value >= 10_000 ? "compact" : "standard" }).format(value);
}

export function formatDuration(totalSeconds: number) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

export function getSignalClass(value: string | number) {
  const normalized = String(value).trim().toLowerCase();

  if (normalized.startsWith("-") || normalized.includes("declining") || normalized.includes("decreased")) {
    return "text-danger";
  }

  if (
    normalized.startsWith("+") ||
    normalized.includes("improving") ||
    normalized.includes("increased") ||
    normalized.includes("growth")
  ) {
    return "text-success";
  }

  return "text-muted";
}

export function getConfidenceToneClass(confidence: number) {
  if (confidence >= 0.75) return "text-success";
  if (confidence >= 0.5) return "text-confidence-moderate";
  return "text-confidence-low";
}
