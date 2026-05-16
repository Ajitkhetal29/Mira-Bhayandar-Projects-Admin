const LIMIT_OPTIONS = [10, 20, 50];

/**
 * @param {{
 *   page: number;
 *   limit: number;
 *   total: number;
 *   totalPages: number;
 *   onPageChange: (page: number) => void;
 *   onLimitChange: (limit: number) => void;
 * }} props
 */
export default function LeadsPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}) {
  if (total <= limit) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-gray-400">
        Showing {from}–{to} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-400">
          Per page
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-2 py-1.5 text-sm text-white"
          >
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-neutral-700"
          >
            Prev
          </button>
          <span className="min-w-[5rem] px-2 text-center text-sm text-gray-300">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-neutral-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export { LIMIT_OPTIONS };
