import { toast } from 'sonner';

// ─── Generic helpers ──────────────────────────────────────────────────────────

export function toastSuccess(title: string, description?: string) {
  toast.success(title, { description });
}

export function toastError(title: string, description?: string) {
  toast.error(title, { description });
}

export function toastInfo(title: string, description?: string) {
  toast.info(title, { description });
}

export function toastWarning(title: string, description?: string) {
  toast.warning(title, { description });
}

export function toastLoading(title: string): string | number {
  return toast.loading(title);
}

export function toastDismiss(id: string | number) {
  toast.dismiss(id);
}

export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: unknown) => string);
  },
) {
  return toast.promise(promise, messages);
}

// ─── Auction-specific presets ─────────────────────────────────────────────────

export const toasts = {
  bidPlaced: (amount: number) =>
    toastSuccess('Bid placed!', `Your bid of $${amount.toLocaleString()} was placed.`),

  bidFailed: (message?: string) =>
    toastError('Failed to place bid', message ?? 'Please try again.'),

  bidPlacedPromise: (promise: Promise<unknown>, amount: number) =>
    toastPromise(promise, {
      loading: 'Placing bid…',
      success: `Bid of $${amount.toLocaleString()} placed!`,
      error: (err) =>
        err instanceof Error ? err.message : 'Failed to place bid',
    }),

  fetchError: (what = 'data') =>
    toastError(`Failed to load ${what}`, 'Please try refreshing the page.'),

  watchAdded: () =>
    toastSuccess('Added to watchlist'),

  watchRemoved: () =>
    toastInfo('Removed from watchlist'),

  notAuthenticated: () =>
    toastInfo('Sign in required', 'Please sign in to continue.'),

  auctionClosed: () =>
    toastInfo('Auction has ended', 'This auction is no longer accepting bids.'),

  copied: (what = 'Link') =>
    toastSuccess(`${what} copied to clipboard`),
} as const;
