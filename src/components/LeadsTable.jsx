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
    return <div className="admin-card admin-empty">{emptyMessage}</div>;
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Message</th>
            <th>Date</th>
            {onDelete ? <th className="text-right">Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr key={String(lead._id)}>
              <td>{rowOffset + i + 1}</td>
              <td className="cell-strong whitespace-nowrap">{lead.name}</td>
              <td>
                <a href={`mailto:${lead.email}`} className="link-gold">
                  {lead.email}
                </a>
              </td>
              <td className="whitespace-nowrap">
                <a
                  href={`tel:${String(lead.phone).replace(/\s/g, "")}`}
                  className="link-gold"
                >
                  {lead.phone}
                </a>
              </td>
              <td className="max-w-xs text-cream">
                <span
                  className="line-clamp-2"
                  title={String(lead.message ?? "")}
                >
                  {lead.message}
                </span>
              </td>
              <td className="whitespace-nowrap">{formatDate(lead.createdAt)}</td>
              {onDelete ? (
                <td className="text-right">
                  <button
                    type="button"
                    onClick={() => onDelete(String(lead._id))}
                    className="admin-btn-danger !py-1.5 !text-xs"
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
