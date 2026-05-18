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
    { title: "Total Projects", value: allProjects.length },
    { title: "Total Blogs", value: allBlogs.length },
    { title: "Total Testimonials", value: allTestimonials.length },
    { title: "Total FAQ", value: allFaq.length },
    {
      title: "Leads today",
      value: leadCounts.todayCount,
      onClick: () => navigate("/allLeads"),
    },
    {
      title: "Total leads",
      value: leadCounts.totalCount,
      onClick: () => navigate("/allLeads"),
    },
  ];

  const refreshLeads = () => {
    setLeadsRefresh((k) => k + 1);
    getLeadCounts();
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1 className="admin-page-title">
          Hello <span className="text-gradient-gold">Admin</span>
        </h1>
        <p className="admin-page-subtitle">
          Here&apos;s a summary of your content.
        </p>
      </header>

      <form
        onSubmit={handleChangePassword}
        className="admin-card mb-10 max-w-md p-5"
      >
        <h2 className="text-lg font-semibold text-cream mb-2">
          Change password
        </h2>
        <p className="text-sm text-cream-muted mb-3">New password</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            required
            className="admin-input flex-1"
          />
          <button type="submit" className="admin-btn-primary shrink-0">
            Update
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Wrapper = stat.onClick ? "button" : "div";
          return (
            <Wrapper
              key={stat.title}
              type={stat.onClick ? "button" : undefined}
              onClick={stat.onClick}
              className={`admin-stat-card text-center w-full ${
                stat.onClick ? "is-clickable" : ""
              }`}
            >
              <div className="accent-bar" />
              <span className="text-sm font-medium text-cream-muted">
                {stat.title}
              </span>
              <span className="mt-2 block text-4xl font-semibold text-cream font-[family-name:var(--font-heading)]">
                {stat.value}
              </span>
            </Wrapper>
          );
        })}
      </div>

      <section className="mt-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-cream font-[family-name:var(--font-heading)]">
              Today&apos;s leads
            </h2>
            <p className="mt-1 text-sm text-cream-muted">
              Enquiries received today — {leadCounts.todayCount} total
            </p>
          </div>
          <button
            type="button"
            onClick={refreshLeads}
            className="admin-btn-secondary"
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
  );
};

export default Dashboard;
