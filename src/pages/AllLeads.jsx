import { useContext, useEffect, useState } from "react";
import { AppConetxt } from "../context/context";
import LeadsListSection from "../components/LeadsListSection";

export default function AllLeads() {
  const { getLeadCounts, leadCounts } = useContext(AppConetxt);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getLeadCounts();
  }, []);

  return (
    <div className="admin-page">
      <header className="admin-page-header flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="admin-page-title">Leads</h1>
          <p className="admin-page-subtitle">
            Website enquiries — {leadCounts.totalCount} total
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setRefreshKey((k) => k + 1);
            getLeadCounts();
          }}
          className="admin-btn-secondary"
        >
          Refresh
        </button>
      </header>

      <LeadsListSection
        refreshTrigger={refreshKey}
        onCountsChange={getLeadCounts}
      />
    </div>
  );
}
