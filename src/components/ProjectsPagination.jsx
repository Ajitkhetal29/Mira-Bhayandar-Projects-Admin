const LIMIT_OPTIONS = [10, 20, 50];

export function getPageNumbers(currentPage, totalPages) {
  if (totalPages <= 0) return [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const set = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);
  return [...set].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
}

/**
 * @param {{
 *   page: number;
 *   limit: number;
 *   total: number;
 *   onPageChange: (page: number) => void;
 *   onLimitChange: (limit: number) => void;
 * }} props
 */
export default function ProjectsPagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = getPageNumbers(page, totalPages);

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-cream-muted">
        {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-cream-muted">
          Per page
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="admin-select !w-auto"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="admin-btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          {pages.map((n, i) => {
            const prev = pages[i - 1];
            const showEllipsis = i > 0 && prev != null && n - prev > 1;
            return (
              <span key={n} className="flex items-center gap-1">
                {showEllipsis ? (
                  <span className="px-1 text-sm text-cream-muted">…</span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onPageChange(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={
                    n === page
                      ? "min-w-[2.25rem] rounded-md border border-gold/50 bg-gold/15 px-2 py-1.5 text-sm font-medium text-gold"
                      : "admin-btn-secondary min-w-[2.25rem] !px-2 !py-1.5 !text-sm"
                  }
                >
                  {n}
                </button>
              </span>
            );
          })}
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="admin-btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export { LIMIT_OPTIONS };
