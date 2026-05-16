import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AppConetxt } from "../context/context";

export default function AddProject() {
  const { backendUrl, token } = useContext(AppConetxt);

  const [form, setForm] = useState({
    name: "",
    builder: "",
    location: "",
    description: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const galleryInputRef = useRef(null);

  const [layouts, setLayouts] = useState([
    {
      id: Date.now(),
      title: "",
      area: "",
      price: "",
      imageFile: null,
      imagePreview: null,
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Helpers
  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  //   const formatBytes = (bytes) => {
  //     if (!bytes) return "0 B";
  //     const sizes = ["B", "KB", "MB", "GB", "TB"];
  //     const i = Math.floor(Math.log(bytes) / Math.log(1024));
  //     return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  //   };

  // Features: add on Enter or comma
  const addFeature = () => {
    const v = featureInput.trim();
    if (!v) return;
    if (!features.includes(v)) setFeatures((p) => [...p, v]);
    setFeatureInput("");
  };

  const removeFeature = (f) => setFeatures((p) => p.filter((x) => x !== f));

  // Gallery upload handlers
  const onGalleryButtonClick = () => galleryInputRef.current?.click();

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newFiles = files.map((file, idx) => ({
      id: Date.now() + idx,
      file,
      preview: URL.createObjectURL(file),
    }));
    setGalleryFiles((p) => [...p, ...newFiles]);
    // clear value so same file selection later triggers change
    e.target.value = null;
  };

  const removeGalleryFile = (id) => {
    setGalleryFiles((p) => {
      const rem = p.find((x) => x.id === id);
      if (rem) URL.revokeObjectURL(rem.preview);
      return p.filter((x) => x.id !== id);
    });
  };

  // Layout handlers
  const addLayout = () => {
    setLayouts((p) => [
      ...p,
      {
        id: Date.now(),
        title: "",
        area: "",
        price: "",
        imageFile: null,
        imagePreview: null,
      },
    ]);
  };

  const removeLayout = (id) => {
    setLayouts((p) => {
      const rem = p.find((x) => x.id === id);
      if (rem?.imagePreview) URL.revokeObjectURL(rem.imagePreview);
      return p.filter((x) => x.id !== id);
    });
  };

  const handleLayoutChange = (id, field, value) => {
    setLayouts((p) =>
      p.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const handleLayoutImage = (id, e) => {
    const file = e.target.files?.[0];
    setLayouts((p) =>
      p.map((l) => {
        if (l.id !== id) return l;
        if (l.imagePreview) URL.revokeObjectURL(l.imagePreview);
        return {
          ...l,
          imageFile: file || null,
          imagePreview: file ? URL.createObjectURL(file) : null,
        };
      })
    );
    e.target.value = null;
  };

  useEffect(() => {
    return () => {
      galleryFiles.forEach((g) => URL.revokeObjectURL(g.preview));
      layouts.forEach(
        (l) => l.imagePreview && URL.revokeObjectURL(l.imagePreview)
      );
    };
  }, []);

  // Submit handler: builds FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!form.name.trim()) return setError("Project name is required");

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("builder", form.builder);
      fd.append("location", form.location);
      fd.append("description", form.description);
      fd.append("slug", slugify(form.name));
      fd.append("features", JSON.stringify(features));

      // gallery files under key 'gallery' (multiple)
      galleryFiles.forEach((g) => fd.append("gallery", g.file));

      // layouts metadata and image files
      const layoutsMeta = layouts.map((l, idx) => ({
        title: l.title,
        area: l.area,
        price: l.price,
        imageKey: `layoutImage_${idx}`,
      }));
      fd.append("layouts", JSON.stringify(layoutsMeta));

      layouts.forEach((l, idx) => {
        if (l.imageFile) fd.append(`layoutImage_${idx}`, l.imageFile);
      });

      //   const res = await axios.post(`${backendUrl}/projects`, fd, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //       Authorization: token ? `Bearer ${token}` : undefined,
      //     },
      //   });

      //   if (res.data?.success) {
      //     setSuccessMsg("Project added successfully");
      //     // reset form and revoke previews
      //     galleryFiles.forEach((g) => URL.revokeObjectURL(g.preview));
      //     layouts.forEach((l) => l.imagePreview && URL.revokeObjectURL(l.imagePreview));
      //     setForm({ name: "", builder: "", location: "", description: "" });
      //     setFeatures([]);
      //     setFeatureInput("");
      //     setGalleryFiles([]);
      //     setLayouts([{ id: Date.now(), title: "", area: "", price: "", imageFile: null, imagePreview: null }]);
      //   } else {
      //     setError(res.data?.message || "Server error");
      //   }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Project Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              placeholder="e.g. Skyline Estate"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Builder</label>
            <input
              value={form.builder}
              onChange={(e) =>
                setForm((p) => ({ ...p, builder: e.target.value }))
              }
              className="w-full rounded border px-3 py-2"
              placeholder="Builder name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              className="w-full rounded border px-3 py-2"
              placeholder="City, neighbourhood"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">Slug (auto)</label>
            <input
              value={slugify(form.name)}
              readOnly
              className="w-full rounded border px-3 py-2 bg-gray-50"
              placeholder="auto-generated slug"
            />
          </div> */}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            className="w-full rounded border px-3 py-2 min-h-[100px]"
            placeholder="Brief description"
          />
        </div>

        {/* features */}
        <div>
          <label className="block text-sm font-medium mb-2">Features</label>
          <div className="flex gap-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
                if (e.key === ",") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Type a feature and press Enter"
              className="flex-1 rounded border px-3 py-2"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Add
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {features.map((f) => (
              <div
                key={f}
                className="bg-gray-100 px-3 py-1 rounded flex items-center gap-2"
              >
                <span className="text-sm">{f}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(f)}
                  aria-label={`Remove ${f}`}
                  className="text-xs text-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* gallery upload */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Gallery Images</label>
            <div className="text-sm text-gray-500">Add multiple images</div>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-gray-600">
                Click add to select images. You can add more later.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden "
                onChange={handleGalleryChange}
              />
              <button
                type="button"
                onClick={onGalleryButtonClick}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add Gallery Images
              </button>
            </div>
          </div>

          {/* gallery preview grid */}
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {galleryFiles.map((g) => (
              <div
                key={g.id}
                className="relative border rounded overflow-hidden"
              >
                <img
                  src={g.preview}
                  alt={g.file.name}
                  className="w-full h-24 object-cover"
                />
                <div className="p-1 text-xs">{g.file.name}</div>
                <div className="absolute top-1 right-1">
                  <button
                    onClick={() => removeGalleryFile(g.id)}
                    className="bg-white/80 rounded-full p-1 text-red-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* layouts */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">Layouts</label>
            <button
              type="button"
              onClick={addLayout}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add Layout
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {layouts.map((l, idx) => (
              <div
                key={l.id}
                className="border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3 items-start"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    value={l.title}
                    onChange={(e) =>
                      handleLayoutChange(l.id, "title", e.target.value)
                    }
                    className="w-full rounded border px-3 py-2"
                    placeholder="2 BHK"
                  />

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Area (sq ft)
                      </label>
                      <input
                        type="number"
                        value={l.area}
                        onChange={(e) =>
                          handleLayoutChange(l.id, "area", e.target.value)
                        }
                        className="w-full rounded border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Price (Lacs)
                      </label>
                      <input
                        type="number"
                        value={l.price}
                        onChange={(e) =>
                          handleLayoutChange(l.id, "price", e.target.value)
                        }
                        className="w-full rounded border px-3 py-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-1">
                      Layout Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLayoutImage(l.id, e)}
                      className="w-full"
                    />
                  </div>

                  {l.imagePreview ? (
                    <div className="w-full mt-2 border rounded overflow-hidden">
                      <img
                        src={l.imagePreview}
                        alt={l.title}
                        className="w-full h-36 object-cover"
                      />
                      <div className="p-2 text-sm flex items-center justify-between">
                        <span className="truncate">{l.imageFile?.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            handleLayoutChange(l.id, "imageFile", null)
                          }
                          className="text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-sm text-gray-500 mt-2">
                      No layout image selected
                    </div>
                  )}

                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => removeLayout(l.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Remove Layout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* error/success */}
        {error && <div className="text-red-600">{error}</div>}
        {successMsg && <div className="text-green-600">{successMsg}</div>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
          >
            {submitting ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}
