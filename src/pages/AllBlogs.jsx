import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppConetxt } from "../context/context";
import ProjectsPagination from "../components/ProjectsPagination";

const DEFAULT_LIMIT = 10;

const AllBlogs = () => {
  const { allBlogs, deleteBlog, navigate, getAllBlogs } = useContext(AppConetxt);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  useEffect(() => {
    getAllBlogs();
  }, []);

  const total = allBlogs?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginatedBlogs = useMemo(() => {
    if (!allBlogs?.length) return [];
    const start = (page - 1) * limit;
    return allBlogs.slice(start, start + limit);
  }, [allBlogs, page, limit]);

  const rowOffset = (page - 1) * limit;

  const handleLimitChange = (nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const isLastOnPage = paginatedBlogs.length === 1 && page > 1;
    await deleteBlog(id);
    if (isLastOnPage) setPage((p) => p - 1);
  };

  if (!allBlogs) {
    return (
      <div className="admin-page flex min-h-[40vh] items-center justify-center">
        <p className="text-cream-muted">Loading blogs…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="admin-page-title">All Blogs</h1>
          <p className="admin-page-subtitle">
            Manage, update, or delete existing blogs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/addBlog")}
          className="admin-btn-primary"
        >
          + Add New Blog
        </button>
      </header>

      {allBlogs.length > 0 ? (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Blog Title</th>
                  <th>Date</th>
                  <th>Writer</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBlogs.map((blog, i) => (
                  <tr key={blog._id}>
                    <td className="cell-strong">{rowOffset + i + 1}</td>
                    <td className="cell-strong whitespace-nowrap">{blog.title}</td>
                    <td className="whitespace-nowrap">
                      {new Date(blog.date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap">{blog.writer}</td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(blog._id)}
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
          <ProjectsPagination
            page={page}
            limit={limit}
            total={total}
            onPageChange={setPage}
            onLimitChange={handleLimitChange}
          />
        </>
      ) : (
        <div className="admin-card admin-empty">
          No blogs found. Get started by adding a new one.
        </div>
      )}
    </div>
  );
};

export default AllBlogs;
