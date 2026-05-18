import React, { useContext, useEffect, useRef, useState } from "react";
import { AppConetxt } from "../context/context";
import axios from "axios";
import { toast } from "react-toastify";
import {
  galleryTitleFromFile,
  uploadProjectFilesToS3,
} from "../utils/s3Upload";

const PROJECT_STATUSES = ["Under Construction", "Ready to Move"];

const MONTHS = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const AddProject = () => {
  const { backendUrl, navigate } = useContext(AppConetxt);

  const [form, setForm] = useState({
    name: "",
    builder: "",
    location: "",
    status: "Under Construction",
    contactNumber: "",
    latitude: "",
    longitude: "",
    description: "",
    reraNo: "",
    reraMonth: "",
    reraYear: "",
  });

  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const galleryInputRef = useRef(null);
  const browcherPdfInputRef = useRef(null);
  const [browcherPdf, setBrowcherPdf] = useState(null);

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const logoInputRef = useRef(null);
  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const coverImageInputRef = useRef(null);
  const [coverVideo, setCoverVideo] = useState(null);
  const coverVideoInputRef = useRef(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const bannerImageInputRef = useRef(null);
  const reraCertInputRef = useRef(null);
  const ocCertInputRef = useRef(null);
  const [reraCertificate, setReraCertificate] = useState(null);
  const [ocCertificate, setOcCertificate] = useState(null);

  const [layouts, setLayouts] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const addFeature = () => {
    const tag = featureInput.trim();
    if (!tag) return;
    if (!features.includes(tag)) setFeatures((prev) => [...prev, tag]);
    setFeatureInput("");
  };
  const removeFeature = (tag) =>
    setFeatures((prev) => prev.filter((f) => f !== tag));

  const onGalleryButtonClick = () => galleryInputRef.current?.click();
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newFiles = files.map((file, idx) => ({
      id: Date.now() + idx,
      file,
      preview: URL.createObjectURL(file),
    }));
    setGalleryImages((prev) => [...prev, ...newFiles]);
  };
  const removeGalleryImage = (id) =>
    setGalleryImages((prev) => {
      const rem = prev.find((x) => x.id === id);
      if (rem) URL.revokeObjectURL(rem.preview);
      return prev.filter((x) => x.id !== id);
    });

  const onCoverImageButtonClick = () => coverImageInputRef.current?.click();
  const handleCoverImageChange = (e) => {
    URL.revokeObjectURL(coverImagePreview);
    const file = e.target.files?.[0];
    setCoverImagePreview(file ? URL.createObjectURL(file) : null);
    setCoverImage(file || null);
    e.target.value = null;
  };

  const onBannerImageButtonClick = () => bannerImageInputRef.current?.click();
  const handleBannerImageChange = (e) => {
    if (bannerImagePreview) URL.revokeObjectURL(bannerImagePreview);
    const file = e.target.files?.[0];
    setBannerImagePreview(file ? URL.createObjectURL(file) : null);
    setBannerImage(file || null);
    e.target.value = null;
  };

  const onLogoButtonClick = () => logoInputRef.current?.click();
  const handleLogoChange = (e) => {
    URL.revokeObjectURL(logoPreview);
    const file = e.target.files?.[0];
    setLogoPreview(file ? URL.createObjectURL(file) : null);
    setLogo(file || null);
    e.target.value = null;
  };

  const addLayout = () =>
    setLayouts((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        area: "",
        price: "",
        imageFile: null,
        imagePreview: null,
      },
    ]);
  const removeLayout = (id) =>
    setLayouts((prev) => {
      const rem = prev.find((x) => x.id === id);
      if (rem?.imagePreview) URL.revokeObjectURL(rem.imagePreview);
      return prev.filter((x) => x.id !== id);
    });
  const handleLayoutChange = (id, field, value) =>
    setLayouts((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  const handleLayoutImage = (id, e) => {
    const file = e.target.files?.[0];
    setLayouts((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              imageFile: file || null,
              imagePreview: file ? URL.createObjectURL(file) : null,
            }
          : l
      )
    );
    e.target.value = null;
  };

  const onBrowcherButtonClick = () => browcherPdfInputRef.current?.click();
  const HandleBrowcherChange = (e) => setBrowcherPdf(e.target.files?.[0]);

  useEffect(() => {
    return () => {
      galleryImages.forEach((g) => URL.revokeObjectURL(g.preview));
      layouts.forEach(
        (l) => l.imagePreview && URL.revokeObjectURL(l.imagePreview)
      );
    };
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!backendUrl) {
      toast.error("VITE_BACKEND_URL is not set");
      return;
    }
    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!logo) {
      toast.error("Logo is required");
      return;
    }
    const completeLayouts = layouts.filter((l) => l.title && l.imageFile);

    setSubmitting(true);
    try {
      const uploadEntries = [
        { field: "logo", file: logo },
        ...(coverImage ? [{ field: "coverImage", file: coverImage }] : []),
        ...(coverVideo ? [{ field: "coverVideo", file: coverVideo }] : []),
        ...(bannerImage ? [{ field: "bannerImage", file: bannerImage }] : []),
        ...(browcherPdf ? [{ field: "browcherPdf", file: browcherPdf }] : []),
        ...(reraCertificate ? [{ field: "reraCertificate", file: reraCertificate }] : []),
        ...(ocCertificate ? [{ field: "ocCertificate", file: ocCertificate }] : []),
        ...galleryImages.map((g) => ({ field: "galleryImages", file: g.file })),
        ...completeLayouts.map((l) => ({
          field: "layoutImages",
          file: l.imageFile,
        })),
      ];

      const uploaded = await uploadProjectFilesToS3(
        backendUrl,
        form.name.trim(),
        uploadEntries
      );

      const urlByField = (field) => {
        const hits = uploaded.filter((u) => u.field === field);
        return hits.map((h) => h.publicUrl);
      };

      const logoUrls = urlByField("logo");
      const galleryUrls = uploaded
        .filter((u) => u.field === "galleryImages")
        .map((u) => ({
          title: galleryTitleFromFile(u.file),
          image: u.publicUrl,
        }));
      const layoutImageUrls = urlByField("layoutImages");

      const layoutsPayload = completeLayouts.map((l, i) => ({
        title: l.title,
        area: l.area,
        price: l.price,
        image: layoutImageUrls[i],
      }));

      const response = await axios.post(
        `${backendUrl}/api/project/addProject`,
        {
          name: form.name,
          builder: form.builder,
          location: form.location,
          status: form.status,
          contactNumber: form.contactNumber.trim(),
          latitude: form.latitude.trim(),
          longitude: form.longitude.trim(),
          description: form.description,
          reraNo: form.reraNo.trim(),
          reraMonth: form.reraMonth || "",
          reraYear: form.reraYear || "",
          features,
          logo: logoUrls[0],
          coverImage: urlByField("coverImage")[0] || "",
          coverVideo: urlByField("coverVideo")[0] || "",
          bannerImage: urlByField("bannerImage")[0] || "",
          browcherPdf: urlByField("browcherPdf")[0] || "",
          reraCertificate: urlByField("reraCertificate")[0] || "",
          ocCertificate: urlByField("ocCertificate")[0] || "",
          galleryImages: galleryUrls,
          layouts: layoutsPayload,
        },
        { timeout: 60_000 }
      );
      if (response.data?.success) {
        toast.success("Project Added Successfully", { autoClose: 2000 });
        navigate("/allprojects");
      } else {
        toast.error(response.data?.message || "Could not save project");
      }
    } catch (error) {
      console.error(error);
      const msg =
        error.code === "ECONNABORTED"
          ? "Upload timed out — try again or use smaller files"
          : error.response?.status === 403
            ? "S3 blocked the upload — add CORS on your bucket for this admin domain"
            : error.response?.data?.message || error.message || "Error saving project";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-gray-900">
      <div className="bg-black backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-6 max-w-5xl w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          🏡 Add New Project
        </h1>

        <form onSubmit={handleSubmitForm} className="space-y-8 text-white">
          <fieldset
            disabled={submitting}
            className="space-y-8 border-0 p-0 m-0 min-w-0 disabled:opacity-60 disabled:pointer-events-none"
          >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label: "Project Name",
                key: "name",
                placeholder: "e.g Skyline Estate",
              },
              {
                label: "Builder Name",
                key: "builder",
                placeholder: "Builder Name",
              },
              { label: "Location", key: "location", placeholder: "Location" },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-semibold mb-2 text-white"
                >
                  {label}
                  {key === "name" ? (
                    <span className="text-red-400 ml-1">*</span>
                  ) : null}
                </label>
                <input
                  id={key}
                  type="text"
                  value={form[key]}
                  required={key === "name"}
                  placeholder={placeholder}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-md bg-gray-800 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            ))}
            <div>
              <label htmlFor="status" className="block text-sm font-semibold mb-2 text-white">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-md bg-gray-800 p-2 text-white focus:ring-2 focus:ring-indigo-500 transition"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-semibold mb-2 text-white">
                Contact number
              </label>
              <input
                id="contactNumber"
                type="tel"
                value={form.contactNumber}
                placeholder="e.g. +91 98765 43210"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactNumber: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-md bg-gray-800 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-semibold mb-2 text-white">
                Map latitude <span className="text-gray-400 font-normal">(optional, WGS84)</span>
              </label>
              <input
                id="latitude"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 19.2812"
                value={form.latitude}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, latitude: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-md bg-gray-800 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-sm font-semibold mb-2 text-white">
                Map longitude <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                id="longitude"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 72.8574"
                value={form.longitude}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, longitude: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-md bg-gray-800 p-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="reraNo" className="block text-sm font-semibold mb-2 text-white">
                RERA number
              </label>
              <input
                id="reraNo"
                type="text"
                value={form.reraNo}
                placeholder="e.g. P51800012345"
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, reraNo: e.target.value }))
                }
                className="w-full p-2 border border-gray-200 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">
                RERA possession (month)
              </label>
              <select
                value={form.reraMonth}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, reraMonth: e.target.value }))
                }
                className="w-full p-2 border border-gray-200 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
              >
                {MONTHS.map((m) => (
                  <option key={m || "none"} value={m}>
                    {m || "—"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-white">
                RERA possession (year)
              </label>
              <input
                type="number"
                placeholder="2026"
                value={form.reraYear}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, reraYear: e.target.value }))
                }
                className="w-full p-2 border border-gray-200 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">
              Logo image <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
              <button
                type="button"
                onClick={onLogoButtonClick}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white hover:border-white transition"
              >
                Upload Logo
              </button>
              {logo && (
                <div className="relative border border-gray-700 rounded-xl overflow-hidden bg-gray-800/70">
                  <img src={logoPreview} className="w-full h-24 object-cover" alt="" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Cover Image</label>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="file"
                ref={coverImageInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleCoverImageChange}
              />
              <button
                type="button"
                onClick={onCoverImageButtonClick}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white hover:border-white transition"
              >
                Upload Cover Image
              </button>
              {coverImage && (
                <div className="relative border border-gray-700 rounded-xl overflow-hidden bg-gray-800/70">
                  <img
                    src={coverImagePreview}
                    className="w-full h-24 object-cover"
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">
              Banner image <span className="text-gray-400">(optional)</span>
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              <input
                type="file"
                ref={bannerImageInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleBannerImageChange}
              />
              <button
                type="button"
                onClick={onBannerImageButtonClick}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white hover:border-white transition"
              >
                Upload banner image
              </button>
              {bannerImage && (
                <div className="relative border border-gray-700 rounded-xl overflow-hidden bg-gray-800/70">
                  <img
                    src={bannerImagePreview}
                    className="w-full h-24 object-cover"
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Cover Video</label>
            <input
              type="file"
              ref={coverVideoInputRef}
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                setCoverVideo(e.target.files?.[0] || null);
                e.target.value = null;
              }}
            />
            <button
              type="button"
              onClick={() => coverVideoInputRef.current?.click()}
              className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
            >
              Upload cover video
            </button>
            {coverVideo && (
              <span className="ml-3 text-sm text-gray-300">{coverVideo.name}</span>
            )}
          </div>


          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm text-white">Gallery Images</label>
              <button
                type="button"
                onClick={onGalleryButtonClick}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Add Images
              </button>
            </div>
            <input
              type="file"
              ref={galleryInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleGalleryChange}
            />
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {galleryImages.map((g) => (
                <div
                  key={g.id}
                  className="relative border border-gray-700 rounded-xl overflow-hidden bg-gray-800/70"
                >
                  <img
                    src={g.preview}
                    alt={g.file.name}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-red-400"
                    onClick={() => removeGalleryImage(g.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm mb-2 text-white"
            >
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              value={form.description}
              required
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Brief description"
              className="w-full rounded-md border border-gray-200 bg-gray-800 p-2 text-white focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-white">Features</label>
            <div className="flex gap-3">
              <input
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="Type a feature and press Enter"
                className="flex-grow p-2 rounded-xl bg-gray-800 border border-black-200 text-white focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {features.map((f) => (
                <div
                  key={f}
                  className="bg-white text-black px-2 py-1 rounded-md flex items-center gap-2 text-sm"
                >
                  <span>{f}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(f)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white mb-2">RERA certificate</label>
              <input
                type="file"
                ref={reraCertInputRef}
                accept=".pdf,application/pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setReraCertificate(file);
                }}
              />
              <button
                type="button"
                onClick={() => reraCertInputRef.current?.click()}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Upload
              </button>
              {reraCertificate && (
                <span className="ml-2 text-sm text-gray-300">{reraCertificate.name}</span>
              )}
            </div>
            <div>
              <label className="block text-sm text-white mb-2">OC certificate</label>
              <input
                type="file"
                ref={ocCertInputRef}
                accept=".pdf,application/pdf,image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setOcCertificate(file);
                }}
              />
              <button
                type="button"
                onClick={() => ocCertInputRef.current?.click()}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Upload
              </button>
              {ocCertificate && (
                <span className="ml-2 text-sm text-gray-300">{ocCertificate.name}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Brochure (PDF)</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={browcherPdfInputRef}
                accept="application/pdf"
                className="hidden"
                onChange={HandleBrowcherChange}
              />
              <button
                type="button"
                onClick={onBrowcherButtonClick}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Upload PDF
              </button>
              {browcherPdf && (
                <span className="text-sm truncate max-w-xs text-white" title={browcherPdf.name}>
                  {browcherPdf.name}
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm text-white">Layouts</label>
              <button
                type="button"
                onClick={addLayout}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Add Layout
              </button>
            </div>
            <div className="space-y-6">
              {layouts.map((l) => (
                <div
                  key={l.id}
                  className="border border-gray-700 rounded-xl p-6 bg-gray-800/70"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <label className="block text-sm mb-1 text-white">Title</label>
                      <input
                        type="text"
                        value={l.title}
                        placeholder="e.g. 1 BHK, Studio, Penthouse"
                        onChange={(e) =>
                          handleLayoutChange(l.id, "title", e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-white">Area (sq ft)</label>
                      <input
                        type="number"
                        value={l.area}
                        onChange={(e) =>
                          handleLayoutChange(l.id, "area", e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-white">Price (Lacs)</label>
                      <input
                        type="number"
                        value={l.price}
                        onChange={(e) =>
                          handleLayoutChange(l.id, "price", e.target.value)
                        }
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-2 text-white focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      id={`layout-img-${l.id}`}
                      className="hidden"
                      onChange={(e) => handleLayoutImage(l.id, e)}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById(`layout-img-${l.id}`)?.click()
                      }
                      className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
                    >
                      Add Image
                    </button>
                  </div>
                  {l.imagePreview && (
                    <div className="mb-4">
                      <img
                        src={l.imagePreview}
                        alt={l.title || "Layout"}
                        className="w-40 h-40 object-cover rounded-xl border border-gray-600"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeLayout(l.id)}
                    className="px-5 py-2 bg-red-500 border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          </fieldset>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-yellow-200 border rounded-md text-black shadow-md hover:bg-black hover:text-white transition disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProject;
