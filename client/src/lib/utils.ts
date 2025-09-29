import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "BHD"): string {
  // Handle BHD specifically as it uses 3 decimal places
  if (currency === "BHD") {
    return new Intl.NumberFormat("en-BH", {
      style: "currency",
      currency: "BHD",
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(amount);
  }
  
  // For other currencies, use standard formatting
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// Adaptive / compact currency formatting for tight UI areas (e.g., KPI cards)
// Rules:
// < 1,000 -> normal (e.g., BHD 532.000)
// >= 1,000 and < 1,000,000 -> abbreviated to K (one decimal if needed) e.g., BHD 138.0K
// >= 1,000,000 and < 1,000,000,000 -> abbreviated to M e.g., BHD 2.3M
// >= 1,000,000,000 -> abbreviated to B e.g., BHD 1.1B
// Always keep currency code prefix (not symbol) to save width and avoid locale symbol variance.
export function formatCurrencyCompact(amount: number, currency = "BHD"): { short: string; full: string } {
  const full = formatCurrency(amount, currency);
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  let shortValue: string;
  const toFixed = (n: number) => (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1));

  if (abs < 1000) {
    shortValue = full; // already small enough
  } else if (abs < 1_000_000) {
    shortValue = `${currency} ${sign}${toFixed(abs / 1000)}K`;
  } else if (abs < 1_000_000_000) {
    shortValue = `${currency} ${sign}${toFixed(abs / 1_000_000)}M`;
  } else {
    shortValue = `${currency} ${sign}${toFixed(abs / 1_000_000_000)}B`;
  }

  return { short: shortValue, full };
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function calculatePrice(costPrice: number, markup: number): number {
  return costPrice / (1 - markup / 100);
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Enquiry statuses
    "New": "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-transparent text-orange-700 border-orange-300 border-2",
    "Quoted": "bg-green-100 text-green-800 border-green-200",
    "Closed": "bg-gray-100 text-gray-800 border-gray-200",
    
    // Quotation statuses
    "Draft": "bg-gray-100 text-gray-800 border-gray-200",
    "Sent": "bg-blue-100 text-blue-800 border-blue-200",
    "Accepted": "bg-green-100 text-green-800 border-green-200",
    "Rejected": "bg-red-100 text-red-800 border-red-200",
    "Expired": "bg-red-100 text-red-800 border-red-200",
    
    // Sales Order statuses
    "Confirmed": "bg-green-100 text-green-800 border-green-200",
    "Processing": "bg-blue-100 text-blue-800 border-blue-200",
    "Shipped": "bg-purple-100 text-purple-800 border-purple-200",
    "Delivered": "bg-green-100 text-green-800 border-green-200",
    "Cancelled": "bg-red-100 text-red-800 border-red-200",
    
    // Goods Receipt statuses
    "Pending": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Partial": "bg-orange-100 text-orange-800 border-orange-200",
    "Complete": "bg-green-100 text-green-800 border-green-200",
    "Discrepancy": "bg-red-100 text-red-800 border-red-200",
    "Approved": "bg-emerald-100 text-emerald-800 border-emerald-200",
  };
  
  return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}
