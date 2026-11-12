import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "../utils";

/**
 * Pagination — full-featured page navigation component.
 *
 * <Pagination
 *   page={3}
 *   totalPages={12}
 *   onPageChange={setPage}
 *   perPage={10}
 *   totalItems={115}
 *   onPerPageChange={setPerPage}
 * />
 */
function Pagination({
  page,
  totalPages,
  onPageChange,
  perPage,
  totalItems,
  onPerPageChange,
  perPageOptions = [10, 20, 50, 100],
  className,
  siblingCount = 1,
}) {
  // ── Page range calculation ───────────────────────────────────────────────
  const getPageNumbers = () => {
    const delta = siblingCount;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (range[range.length - 1] < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1 && !onPerPageChange) return null;

  const startItem = (page - 1) * (perPage ?? 10) + 1;
  const endItem = Math.min(page * (perPage ?? 10), totalItems ?? 0);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4",
        className
      )}
    >
      {/* Item count */}
      {totalItems != null && (
        <p className="text-sm text-gray-500 shrink-0">
          Showing{" "}
          <span className="font-semibold text-gray-700">
            {startItem}–{endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-700">{totalItems}</span>
        </p>
      )}

      {/* Page buttons */}
      <nav
        className="flex items-center gap-1"
        aria-label="Pagination"
        role="navigation"
      >
        {/* Prev */}
        <PaginationButton
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationButton>

        {/* Page numbers */}
        {getPageNumbers().map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-3 py-1.5 text-sm text-gray-400 select-none"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <PaginationButton
              key={p}
              active={p === page}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </PaginationButton>
          )
        )}

        {/* Next */}
        <PaginationButton
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationButton>
      </nav>

      {/* Per-page selector */}
      {onPerPageChange && (
        <div className="flex items-center gap-2 shrink-0">
          <label className="text-sm text-gray-500">Rows:</label>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
          >
            {perPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function PaginationButton({ children, active, disabled, className, ...props }) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "min-w-[36px] h-9 px-2.5 rounded-lg text-sm font-medium transition-all duration-150",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
        active
          ? "bg-emerald-600 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { Pagination, PaginationButton };

