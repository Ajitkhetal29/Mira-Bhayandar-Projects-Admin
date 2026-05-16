import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppConetxt } from "../context/context";
import LeadsListSection from "../components/LeadsListSection";

const Dashboard = () => {
  const {
    allProjects,
    allBlogs,
    allTestimonials,
    allFaq,
    leadCounts,
    getLeadCounts,
    backendUrl,
    token,
    navigate,
  } = useContext(AppConetxt);
  const [newPassword, setNewPassword] = useState("");
  const [leadsRefresh, setLeadsRefresh] = useState(0);

  useEffect(() => {
    getLeadCounts();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const auth = token || localStorage.getItem("token");
    if (!auth) return;
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setNewPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update password");
    }
  };

  const stats = [
    {
      title: "Total Projects",
      value: allProjects.length,
      colorClass: "border-cyan-400",
    },
    {
      title: "Total Blogs",
      value: allBlogs.length,
      colorClass: "border-yellow-400",
    },
    {
      title: "Total Testimonials",
      value: allTestimonials.length,
      colorClass: "border-green-400",
    },
    {
      title: "Total FAQ",
      value: allFaq.length,
      colorClass: "border-purple-400",
    },
    {
      title: "Leads today",
      value: leadCounts.todayCount,
      colorClass: "border-rose-400",
      onClick: () => navigate("/allLeads"),
    },
    {
      title: "Total leads",
      value: leadCounts.totalCount,
      colorClass: "border-orange-400",
      onClick: () => navigate("/allLeads"),
    },
  ];

  const refreshLeads = () => {
    setLeadsRefresh((k) => k + 1);
    getLeadCounts();
  };

  return (
    <main className="bg-neutral-950 min-h-screen text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-10 pt-28 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white border-b border-gray-700 pb-4">
            Hello Admin
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Here's a summary of your content.
          </p>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="mb-10 max-w-md rounded-lg border border-neutral-800 bg-neutral-900 p-4"
        >
          <h2 className="text-lg font-semibold text-white mb-2">Change password</h2>
          <p className="text-sm text-gray-400 mb-3">New password</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              required
              className="flex-1 rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-white placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500"
            >
              Update
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Wrapper = stat.onClick ? "button" : "div";
            return (
              <Wrapper
                key={stat.title}
                type={stat.onClick ? "button" : undefined}
                onClick={stat.onClick}
                className={`
                  bg-neutral-900 rounded-lg p-6 shadow-lg 
                  border-t-4 ${stat.colorClass} 
                  transition-transform duration-300 hover:scale-105
                  flex flex-col items-center justify-center text-center w-full
                  ${stat.onClick ? "cursor-pointer hover:bg-neutral-800/80" : ""}
                `}
              >
                <span className="text-lg font-semibold text-gray-300">
                  {stat.title}
                </span>
                <span className="mt-2 text-4xl font-bold text-white">
                  {stat.value}
                </span>
              </Wrapper>
            );
          })}
        </div>

        <section className="mt-14">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Today&apos;s leads</h2>
              <p className="mt-1 text-sm text-gray-400">
                Enquiries received today — {leadCounts.todayCount} total
              </p>
            </div>
            <button
              type="button"
              onClick={refreshLeads}
              className="rounded-md border border-neutral-700 bg-neutral-800 px-4 py-2 text-xs font-semibold text-gray-200 hover:bg-neutral-700"
            >
              Refresh
            </button>
          </div>
          <LeadsListSection
            today
            refreshTrigger={leadsRefresh}
            onCountsChange={getLeadCounts}
            emptyMessage="No leads received today."
          />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
