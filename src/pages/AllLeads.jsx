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
    <main className="bg-neutral-950 min-h-screen text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-10 pt-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">Leads</h1>
            <p className="mt-1 text-lg text-gray-400">
              Website enquiries — {leadCounts.totalCount} total
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setRefreshKey((k) => k + 1);
              getLeadCounts();
            }}
            className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-neutral-700"
          >
            Refresh
          </button>
        </div>

        <LeadsListSection
          refreshTrigger={refreshKey}
          onCountsChange={getLeadCounts}
        />
      </div>
    </main>
  );
}
