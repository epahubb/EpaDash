import { useState, useMemo, useCallback } from "react";
function usePagination(options = {}) {
  const { initialPage = 1, initialPerPage = 10, totalItems = 0 } = options;
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / perPage));
  }, [totalItems, perPage]);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);
  const prevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1));
  }, []);
  const goToPage = useCallback(
    (targetPage) => {
      setPage(Math.max(1, Math.min(totalPages, targetPage)));
    },
    [totalPages]
  );
  return {
    page,
    perPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    setPage: goToPage,
    setPerPage,
    nextPage,
    prevPage
  };
}
export {
  usePagination
};
