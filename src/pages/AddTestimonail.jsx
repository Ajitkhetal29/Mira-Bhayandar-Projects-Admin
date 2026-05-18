import React, { useContext, useState } from "react";
import { AppConetxt } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";

const AddTestimonail = () => {
  const { navigate, backendUrl, allProjects } = useContext(AppConetxt);

  const [form, setForm] = useState({
    name: "",
    message: "",
    purchasedAtProject: "",
    starCount: "5",
  });

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.purchasedAtProject) {
      toast.error("Select a project", { autoClose: 2500 });
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/testimonial/addTestimonial`,
        {
          name: form.name.trim(),
          message: form.message.trim(),
          purchasedAtProject: form.purchasedAtProject,
          starCount: Number(form.starCount) || 5,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 2000 });
        navigate("/allTestimonials");
      } else {
        toast.error(response.data.message || "Could not create testimonial");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Could not create testimonial";
      toast.error(msg);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-form-card max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          Add New Testimonial
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-white">
              Client Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              required
              placeholder="Enter client name"
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleFormChange}
              required
              placeholder="Testimonial text"
              rows={5}
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-1">
              Purchased at (project)
            </label>
            <select
              name="purchasedAtProject"
              value={form.purchasedAtProject}
              onChange={handleFormChange}
              required
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select a project</option>
              {allProjects?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            {allProjects?.length === 0 && (
              <p className="text-xs text-amber-400 mt-1">
                No projects loaded — add a project first or refresh.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-white mb-1">
              Star rating (out of 5)
            </label>
            <select
              name="starCount"
              value={form.starCount}
              onChange={handleFormChange}
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-yellow-200 border rounded-md text-black shadow-md hover:bg-black hover:text-white hover:border-white transition"
            >
              Create testimonial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestimonail;
