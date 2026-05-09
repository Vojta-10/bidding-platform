import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const protectedPaths = ['dashboard'];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString('en-US');
}

export function getPageNumbers(
  current: number,
  total: number,
): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | 'ellipsis')[] = [1];

  if (current > 3) pages.push('ellipsis');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('ellipsis');

  pages.push(total);
  return pages;
}

export function calcTimeLeft(deadline: string, extend = false) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { text: 'Ended', urgent: false };

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (days > 0)
    return {
      text: extend ? `${days}d ${hours}h ${minutes}m` : `${days}d ${hours}h`,
      urgent: false,
    };
  if (hours > 0)
    return {
      text: extend
        ? `${hours}h ${minutes}m ${seconds}s`
        : `${hours}h ${minutes}m`,
      urgent: false,
    };
  return {
    text: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    urgent: true,
  };
}
