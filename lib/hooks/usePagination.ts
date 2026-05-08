import { useEffect, useState } from 'react';

interface UsePaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  setPage: (page: number) => void;
  changePageSize: (size: number) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  goPrev: () => void;
  goNext: () => void;
}

export function usePagination(
  total: number,
  initialPageSize = 10,
): UsePaginationReturn {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Clamp page when items are removed and current page no longer exists
  useEffect(() => {
    const clamp = () => {
      setPage((p) => Math.min(p, totalPages));
    };
    clamp();
  }, [totalPages]);

  function changePageSize(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return {
    page,
    pageSize,
    totalPages,
    setPage,
    changePageSize,
    canGoPrev: page > 1,
    canGoNext: page < totalPages,
    goPrev: () => setPage((p) => Math.max(1, p - 1)),
    goNext: () => setPage((p) => Math.min(totalPages, p + 1)),
  };
}
