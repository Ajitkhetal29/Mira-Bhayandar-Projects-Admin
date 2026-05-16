function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

/**
 * @param {{
 *   leads: Array<Record<string, unknown>>;
 *   onDelete?: (id: string) => void;
 *   emptyMessage?: string;
 *   rowOffset?: number;
 * }} props
 */
export default function LeadsTable({
  leads,
  onDelete,
  emptyMessage = "No leads yet.",
  rowOffset = 0,
}) {
  if (!leads?.length) {
    return (
      <div className="p-8 text-center text-gray-500 bg-neutral-900 border border-neutral-800 rounded-lg">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-2xl rounded-lg bg-neutral-900 border border-neutral-800">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-neutral-800">
          <tr>
            <th className="px-6 py-4">#</th>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Phone</th>
            <th className="px-6 py-4">Message</th>
            <th className="px-6 py-4">Date</th>
            {onDelete ? <th className="px-6 py-4 text-right">Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr
              key={String(lead._id)}
              className="border-b border-neutral-800 hover:bg-neutral-800/50"
            >
              <td className="px-6 py-4">{rowOffset + i + 1}</td>
              <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                {lead.name}
              </td>
              <td className="px-6 py-4">
                <a
                  href={`mailto:${lead.email}`}
                  className="text-cyan-400 hover:underline"
                >
                  {lead.email}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a
                  href={`tel:${String(lead.phone).replace(/\s/g, "")}`}
                  className="text-cyan-400 hover:underline"
                >
                  {lead.phone}
                </a>
              </td>
              <td className="px-6 py-4 max-w-xs text-white">
                <span className="line-clamp-2" title={String(lead.message ?? "")}>
                  {lead.message}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                {formatDate(lead.createdAt)}
              </td>
              {onDelete ? (
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(String(lead._id))}
                    className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold"
                  >
                    Delete
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
