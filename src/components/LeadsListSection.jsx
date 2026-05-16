import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppConetxt } from "../context/context";
import LeadsTable from "./LeadsTable";
import LeadsPagination, { LIMIT_OPTIONS } from "./LeadsPagination";

const DEFAULT_LIMIT = 20;

/**
 * @param {{
 *   today?: boolean;
 *   emptyMessage?: string;
 *   onCountsChange?: () => void;
 *   refreshTrigger?: number;
 * }} props
 */
export default function LeadsListSection({
  today = false,
  emptyMessage = "No leads yet.",
  onCountsChange,
  refreshTrigger = 0,
}) {
  const { backendUrl, token } = useContext(AppConetxt);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const authHeaders = useCallback(() => {
    const auth = token || localStorage.getItem("token");
    return auth ? { Authorization: `Bearer ${auth}` } : {};
  }, [token]);

  const fetchLeads = useCallback(
    async (pageNum, limitNum) => {
      if (!backendUrl) return;
      const auth = token || localStorage.getItem("token");
      if (!auth) return;

      setLoading(true);
      try {
        const params = { page: pageNum, limit: limitNum };
        if (today) params.today = "true";

        const { data } = await axios.get(`${backendUrl}/api/lead/allLeads`, {
          headers: authHeaders(),
          params,
        });

        if (data?.success) {
          setLeads(data.leads ?? []);
          const p = data.pagination ?? {};
          setTotal(p.total ?? 0);
          setTotalPages(p.totalPages ?? 0);
          setPage(p.page ?? pageNum);
          setLimit(p.limit ?? limitNum);
        }
      } catch (err) {
        console.error("fetchLeads:", err);
        toast.error(err.response?.data?.message || "Could not load leads");
      } finally {
        setLoading(false);
      }
    },
    [backendUrl, today, authHeaders, token]
  );

  useEffect(() => {
    fetchLeads(page, limit);
  }, [page, limit, fetchLeads, refreshTrigger]);

  const handleDelete = async (id) => {
    const auth = token || localStorage.getItem("token");
    if (!auth) return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/lead/deleteLead/${id}`, {
        headers: authHeaders(),
      });
      if (data?.success) {
        toast.warning("Lead deleted", { autoClose: 2000 });
        onCountsChange?.();
        const nextPage =
          leads.length === 1 && page > 1 ? page - 1 : page;
        if (nextPage !== page) {
          setPage(nextPage);
        } else {
          fetchLeads(nextPage, limit);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete lead");
    }
  };

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const rowOffset = (page - 1) * limit;

  if (loading && leads.length === 0) {
    return <p className="text-sm text-gray-500">Loading leads…</p>;
  }

  return (
    <>
      <LeadsTable
        leads={leads}
        rowOffset={rowOffset}
        onDelete={handleDelete}
        emptyMessage={emptyMessage}
      />
      <LeadsPagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
      />
    </>
  );
}

export { DEFAULT_LIMIT, LIMIT_OPTIONS };
