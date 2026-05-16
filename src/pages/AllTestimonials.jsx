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
      <div className="p-6 text-center text-gray-400 dark:text-gray-300">
        Loading Testimonials...
      </div>
    );
  }

  return (
    <main className="bg-neutral-950 min-h-screen text-white">
      <div className="w-full max-w-7xl mx-auto px-4 py-10 pt-10 sm:px-6 lg:px-8">
        {/* --- Page Header --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              All Testimonials
            </h1>
            <p className="mt-1 text-lg text-gray-400">
              Manage, update, or delete existing Testimonials.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/addTestimonial")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-bold shadow-lg transition-colors duration-300 whitespace-nowrap"
          >
            + Add Testimonial
          </button>
        </div>

        {allTestimonials && allTestimonials.length > 0 ? (
          <div className="overflow-x-auto shadow-2xl rounded-lg bg-neutral-900 border border-neutral-800">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-neutral-800">
                <tr>
                  <th className="px-6 py-4">Sr.</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Message</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Stars</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {allTestimonials.map((test, i) => (
                  <tr
                    key={test._id}
                    className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-white">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                      {test.name}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {test.message && test.message.length > 50
                        ? `${test.message.slice(0, 50)}...`
                        : (test.message ?? "")}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {test.purchasedAtProject?.name ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {test.starCount != null ? `${test.starCount}/5` : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <button
                          type="button"
                          onClick={() => deleteTestimonial(test._id)}
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
            No Testimonial Found. Get started by adding a new one!
          </div>
        )}
      </div>
    </main>
  );
};

export default AllTestimonials;
