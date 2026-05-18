import React, { useContext, useEffect } from "react";
import { AppConetxt } from "../context/context";

const AllTestimonials = () => {
  const { allTestimonials, deleteTestimonial, getAllTestimonials, navigate } =
    useContext(AppConetxt);

  useEffect(() => {
    getAllTestimonials();
  }, []);

  if (!allTestimonials) {
    return (
      <div className="admin-page flex min-h-[40vh] items-center justify-center">
        <p className="text-cream-muted">Loading testimonials…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="admin-page-title">All Testimonials</h1>
          <p className="admin-page-subtitle">
            Manage, update, or delete existing testimonials.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/addTestimonial")}
          className="admin-btn-primary"
        >
          + Add Testimonial
        </button>
      </header>

      {allTestimonials.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Name</th>
                <th>Message</th>
                <th>Project</th>
                <th>Stars</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {allTestimonials.map((test, i) => (
                <tr key={test._id}>
                  <td className="cell-strong">{i + 1}</td>
                  <td className="cell-strong whitespace-nowrap">{test.name}</td>
                  <td className="text-cream max-w-xs">
                    {test.message && test.message.length > 50
                      ? `${test.message.slice(0, 50)}...`
                      : (test.message ?? "")}
                  </td>
                  <td>{test.purchasedAtProject?.name ?? "—"}</td>
                  <td>{test.starCount != null ? `${test.starCount}/5` : "—"}</td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => deleteTestimonial(test._id)}
                      className="admin-btn-danger !py-1.5 !text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-card admin-empty">
          No testimonials found. Get started by adding a new one.
        </div>
      )}
    </div>
  );
};

export default AllTestimonials;
