import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatNumber(val, decimals = 4) {
  if (val === null || val === undefined || isNaN(val)) return "N/A";
  return Number(val).toFixed(decimals);
}

export function getDiceColor(dice) {
  if (dice === null || dice === undefined) return "text-zinc-500";
  if (dice >= 0.85) return "text-emerald-400";
  if (dice >= 0.70) return "text-teal-400";
  if (dice >= 0.50) return "text-cyan-400";
  if (dice >= 0.30) return "text-amber-400";
  return "text-rose-400";
}

export function getDiceBg(dice) {
  if (dice === null || dice === undefined) return "bg-zinc-900 border-zinc-800 text-zinc-400";
  if (dice >= 0.85) return "bg-emerald-950/40 border-emerald-800/60 text-emerald-300";
  if (dice >= 0.70) return "bg-teal-950/40 border-teal-800/60 text-teal-300";
  if (dice >= 0.50) return "bg-cyan-950/40 border-cyan-800/60 text-cyan-300";
  if (dice >= 0.30) return "bg-amber-950/40 border-amber-800/60 text-amber-300";
  return "bg-rose-950/40 border-rose-800/60 text-rose-300";
}
