import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUZS(amount: number): string {
  return new Intl.NumberFormat('uz-UZ').format(amount).replace(/,/g, ' ') + " so‘m";
}

