import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 100% deterministic currency formatter across all SSR and Client browsers (prevents hydration mismatch)
export function formatUZS(amount: number): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0 so'm";
  }
  const cleanNum = Math.round(amount).toString();
  const spaced = cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${spaced} so'm`;
}
