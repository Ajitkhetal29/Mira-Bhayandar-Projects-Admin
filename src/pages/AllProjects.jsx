import React, { useContext, useEffect } from "react";
import { AppConetxt } from "../context/context";

const AllProjects = () => {
  const { allProjects, navigate, deleteProject, getAllProjects } =
    useContext(AppConetxt);

  useEffect(() => {
    getAllProjects();
  }, []);

  if (!allProjects) {
    return (
      <div className="admin-page flex min-h-[40vh] items-center justify-center">
        <p className="text-cream-muted">Loading projects…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="admin-page-title">All Projects</h1>
          <p className="admin-page-subtitle">
            Manage, update, or delete existing projects.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/addProject")}
          className="admin-btn-primary"
        >
          + Add New Project
        </button>
      </header>

      {allProjects.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Project Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>On website</th>
                <th>Contact</th>
                <th>RERA no.</th>
                <th>RERA possession</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProjects.map((project, i) => (
                <tr key={project._id}>
                  <td className="cell-strong">{i + 1}</td>
                  <td className="cell-strong whitespace-nowrap">{project.name}</td>
                  <td>{project.location}</td>
                  <td>{project.status || "Under Construction"}</td>
                  <td>
                    <span
                      className={
                        project.active !== false
                          ? "inline-flex rounded-full bg-emerald-900/40 px-2 py-0.5 text-xs text-emerald-300"
                          : "inline-flex rounded-full bg-gray-700 px-2 py-0.5 text-xs text-gray-400"
                      }
                    >
                      {project.active !== false ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    {project.contactNumber ? (
                      <a
                        href={`tel:${String(project.contactNumber).replace(/\s/g, "")}`}
                        className="link-gold"
                      >
                        {project.contactNumber}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap">{project.reraNo || "—"}</td>
                  <td>
                    {[project.reraPossession?.month, project.reraPossession?.year]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/updateProject/${project._id}`)}
                        className="admin-btn-secondary !py-1.5 !text-xs"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProject(project._id)}
                        className="admin-btn-danger !py-1.5 !text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-card admin-empty">
          No projects found. Get started by adding a new one.
        </div>
      )}
    </div>
  );
};

export default AllProjects;
