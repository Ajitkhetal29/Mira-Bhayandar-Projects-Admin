import React, { useContext, useEffect } from "react";
import { AppConetxt } from "../context/context";

const AllProjects = () => {
  const { allProjects, navigate, deleteProject, getAllProjects } = useContext(AppConetxt);

  useEffect(() => {
    // Fetch projects when the component mounts
    getAllProjects()
  }
  , []);

  if (!allProjects) {
    return (
      <main className="bg-neutral-950 min-h-screen flex items-center justify-center">
        <div className="text-center text-gray-400">Loading Projects...</div>
      </main>
    );
  }

  return (
    <main className="bg-neutral-950 min-h-screen text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-10 pt-10 sm:px-6 lg:px-8">
        {/* --- Page Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              All Projects
            </h1>
            <p className="mt-1 text-lg text-gray-400">
              Manage, update, or delete existing projects.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/addProject")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-bold shadow-lg transition-colors duration-300 whitespace-nowrap"
          >
            + Add New Project
          </button>
        </div>

        {allProjects && allProjects.length > 0 ? (
          <div className="overflow-x-auto shadow-2xl rounded-lg bg-neutral-900 border border-neutral-800">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-neutral-800">
                <tr>
                  <th className="px-6 py-4">Sr.</th>
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">RERA possession</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {allProjects.map((project, i) => (
                  <tr
                    key={project._id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-white">{i + 1}</td>
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                      {project.name}
                    </td>
                    <td className="px-6 py-4">{project.location}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {project.status || "Under Construction"}
                    </td>
                    <td className="px-6 py-4 text-gray-300 whitespace-nowrap">
                      {project.contactNumber ? (
                        <a
                          href={`tel:${String(project.contactNumber).replace(/\s/g, "")}`}
                          className="text-amber-400 hover:underline"
                        >
                          {project.contactNumber}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {[project.reraPossession?.month, project.reraPossession?.year]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          onClick={() => navigate(`/updateProject/${project._id}`)}
                          className="px-4 py-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow transition-colors"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProject(project._id)}
                          className="px-4 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold shadow transition-colors"
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
          <div className="p-8 text-center text-gray-500 bg-neutral-900 border border-neutral-800 rounded-lg shadow-lg">
            No Projects Found. Get started by adding a new one!
          </div>
        )}
      </div>
    </main>
  );
};

export default AllProjects;