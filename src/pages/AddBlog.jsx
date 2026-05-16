import React, { useContext, useState } from "react";
import { AppConetxt } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";

const AddBlog = () => {
  const { navigate, backendUrl } = useContext(AppConetxt);

  const [formData, setFormData] = useState({
    title: "",
    tagline: "",
    content: "",
    writer: "",
  });

  const [blogImage, setBlogImage] = useState(null);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("tagline", formData.tagline);
    fd.append("content", formData.content);
    fd.append("writer", formData.writer);
    fd.append("blogImage", blogImage);

    try {
      const response = await axios.post(`${backendUrl}/api/blog/addBlog`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Blog Created", { autoClose: 2000 });
        navigate("/allBlogs");
      } else {
        toast.error("Failed to create blog", { autoClose: 2000 });
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred", { autoClose: 2000 });
    }
  };

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-gray-900">
      <div className="bg-black backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-6 max-w-5xl w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          Add New Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm  mb-2 text-white">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
              placeholder="Enter blog title"
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="block text-sm mb-2 text-white">Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleFormChange}
              placeholder="e.g. Infrastructure, Market update, Regulation"
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              One short category or label for this post (optional).
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-white mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleFormChange}
              required
              placeholder="Write your blog content..."
              rows={5}
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Writer */}
          <div>
            <label className="block text-sm  text-white mb-1">
              Writer
            </label>
            <input
              type="text"
              name="writer"
              value={formData.writer}
              onChange={handleFormChange}
              required
              placeholder="Author name"
              className="w-full text-white rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Blog Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm rounded-lg border border-gray-300 bg-gray-800 px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-black hover:file:text-white"
            />
            {blogImage && (
              <p className="mt-2 text-sm text-white">
                Selected: {blogImage.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
                      className="px-5 py-2 bg-yellow-200  border rounded-md text-black shadow-md hover:bg-black hover:text-white hover:border-white transition"
            >
              Create Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;
