import React, { useContext, useEffect, useRef, useState } from "react";
import { AppConetxt } from "../context/context";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { resolveAssetUrl } from "../utils/resolveAssetUrl";
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

const UpdateProject = () => {
  const { allProjects, backendUrl, navigate } = useContext(AppConetxt);
  const { id } = useParams();
  const asset = (path) => resolveAssetUrl(path, backendUrl);

  const inputFeatureRef = useRef();
  const inputGalleryRef = useRef();
  const browcherPdfInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const coverImageInputRef = useRef(null);
  const bannerImageInputRef = useRef(null);
  const coverVideoInputRef = useRef(null);
  const reraCertInputRef = useRef(null);
  const ocCertInputRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [editableProject, setEditableProject] = useState(null);

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

  const [features, setFeatures] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [newGalleryImages, setNewGalleryImages] = useState([]);
  const [browcherPdf, setBrowcherPdf] = useState(null);
  const [pdfChanged, setPdfChanged] = useState(false);

  const [layouts, setLayouts] = useState([]);
  const [newLayouts, setNewLayouts] = useState([]);

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoChanged, setLogoChanged] = useState(false);

  const [coverImage, setCoverImage] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [coverImageChanged, setCoverImageChanged] = useState(false);

  const [bannerImage, setBannerImage] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [bannerImageChanged, setBannerImageChanged] = useState(false);

  const [coverVideo, setCoverVideo] = useState(null);
  const [coverVideoPreview, setCoverVideoPreview] = useState(null);
  const [coverVideoChanged, setCoverVideoChanged] = useState(false);

  const [reraCertificate, setReraCertificate] = useState(null);
  const [ocCertificate, setOcCertificate] = useState(null);
  const [reraCertificateChanged, setReraCertificateChanged] = useState(false);
  const [ocCertificateChanged, setOcCertificateChanged] = useState(false);

  useEffect(() => {
    const found = allProjects?.find((p) => p._id === id);
    if (found) {
      setEditableProject(found);
      setForm({
        name: found.name || "",
        builder: found.builder || "",
        location: found.location || "",
        status: found.status || "Under Construction",
        contactNumber: found.contactNumber || "",
        latitude: found.latitude != null && found.latitude !== "" ? String(found.latitude) : "",
        longitude:
          found.longitude != null && found.longitude !== "" ? String(found.longitude) : "",
        description: found.description || "",
        reraNo: found.reraNo || "",
        reraMonth: found.reraPossession?.month || "",
        reraYear:
          found.reraPossession?.year != null
            ? String(found.reraPossession.year)
            : "",
      });
      setFeatures(found.features || []);
      setGalleryImages(found.galleryImages || []);
      setLayouts(found.layouts || []);
      setNewGalleryImages([]);
      setNewLayouts([]);
      setBrowcherPdf(found.browcherPdf || null);
      setPdfChanged(false);
      setLogo(found.logo || null);
      setCoverImage(found.coverImage || null);
      setBannerImage(found.bannerImage || null);
      setCoverVideo(found.coverVideo || null);
      setLogoChanged(false);
      setCoverImageChanged(false);
      setBannerImageChanged(false);
      setCoverVideoChanged(false);
      setReraCertificate(null);
      setOcCertificate(null);
      setReraCertificateChanged(false);
      setOcCertificateChanged(false);
      setLogoPreview(null);
      setCoverImagePreview(null);
      setBannerImagePreview(null);
      setCoverVideoPreview(null);
    }
  }, [id, allProjects]);

  useEffect(() => {
    return () => {
      newGalleryImages.forEach((g) => URL.revokeObjectURL(g.preview));
      newLayouts.forEach(
        (l) => l.imagePreview && URL.revokeObjectURL(l.imagePreview)
      );
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      if (bannerImagePreview) URL.revokeObjectURL(bannerImagePreview);
      if (coverVideoPreview) URL.revokeObjectURL(coverVideoPreview);
    };
  }, [
    newGalleryImages,
    newLayouts,
    logoPreview,
    coverImagePreview,
    bannerImagePreview,
    coverVideoPreview,
  ]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFeature = () => {
    const text = inputFeatureRef.current?.value?.trim();
    if (text && !features.includes(text)) {
      setFeatures((prev) => [...prev, text]);
      inputFeatureRef.current.value = "";
    }
  };

  const removeFeature = (f) =>
    setFeatures((prev) => prev.filter((x) => x !== f));

  const onGalleryButtonClick = () => inputGalleryRef.current?.click();
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newFiles = files.map((file, idx) => ({
      id: Date.now() + idx,
      file,
      preview: URL.createObjectURL(file),
    }));
    setNewGalleryImages((prev) => [...prev, ...newFiles]);
  };
  const removeGalleryImage = (id) =>
    setGalleryImages((prev) => prev.filter((img) => img._id !== id));
  const removeNewGalleryImage = (id) => {
    const rem = newGalleryImages.find((g) => g.id === id);
    if (rem?.preview) URL.revokeObjectURL(rem.preview);
    setNewGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onLogoButtonClick = () => logoInputRef.current?.click();
  const handleLogoChange = (e) => {
    setLogoChanged(true);
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    const file = e.target.files?.[0];
    setLogo(file || null);
    setLogoPreview(file ? URL.createObjectURL(file) : null);
  };

  const onCoverImageButtonClick = () => coverImageInputRef.current?.click();
  const handleCoverImageChange = (e) => {
    setCoverImageChanged(true);
    if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
    const file = e.target.files?.[0];
    setCoverImage(file || null);
    setCoverImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const onBannerImageButtonClick = () => bannerImageInputRef.current?.click();
  const handleBannerImageChange = (e) => {
    setBannerImageChanged(true);
    if (bannerImagePreview) URL.revokeObjectURL(bannerImagePreview);
    const file = e.target.files?.[0];
    setBannerImage(file || null);
    setBannerImagePreview(file ? URL.createObjectURL(file) : null);
    e.target.value = null;
  };

  const handleCoverVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverVideoChanged(true);
    if (coverVideoPreview) URL.revokeObjectURL(coverVideoPreview);
    setCoverVideo(file);
    setCoverVideoPreview(URL.createObjectURL(file));
    e.target.value = null;
  };

  const onBrowcherButtonClick = () => browcherPdfInputRef.current?.click();
  const handleBrowcherChange = (e) => {
    setPdfChanged(true);
    setBrowcherPdf(e.target.files?.[0]);
  };

  const handleReraCertChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReraCertificate(file);
    setReraCertificateChanged(true);
  };

  const handleOcCertChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcCertificate(file);
    setOcCertificateChanged(true);
  };

  const handleAddLayout = () => {
    setNewLayouts((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        area: "",
        price: "",
        image: null,
        imagePreview: null,
      },
    ]);
  };

  const removeLayout = (lid) =>
    setLayouts((prev) => prev.filter((l) => l._id !== lid));
  const removeNewLayout = (lid) => {
    const rem = newLayouts.find((l) => l.id === lid);
    if (rem?.imagePreview) URL.revokeObjectURL(rem.imagePreview);
    setNewLayouts((prev) => prev.filter((l) => l.id !== lid));
  };

  const handleLayoutChange = (lid, e) => {
    const { name, value } = e.target;
    setLayouts((prev) =>
      prev.map((l) => (l._id === lid ? { ...l, [name]: value } : l))
    );
  };
  const handleNewLayoutChange = (lid, e) => {
    const { name, value } = e.target;
    setNewLayouts((prev) =>
      prev.map((l) => (l.id === lid ? { ...l, [name]: value } : l))
    );
  };

  const handleLayoutImageChange = (lid, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const removedLayout = layouts.find((l) => l._id === lid);
    if (!removedLayout) return;
    const { _id: _removedId, ...layoutRest } = removedLayout;
    setLayouts((prev) => prev.filter((l) => l._id !== lid));
    setNewLayouts((prev) => [
      ...prev,
      {
        ...layoutRest,
        id: Date.now(),
        image: file,
        imagePreview: URL.createObjectURL(file),
      },
    ]);
  };

  const handleNewLayoutImageChange = (lid, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewLayouts((prev) =>
      prev.map((l) =>
        l.id === lid
          ? { ...l, image: file, imagePreview: URL.createObjectURL(file) }
          : l
      )
    );
  };

  const discard = () => navigate("/allProjects");

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }
    setSubmitting(true);
    try {
      const uploadEntries = [];
      if (pdfChanged && browcherPdf instanceof File)
        uploadEntries.push({ field: "browcherPdf", file: browcherPdf });
      if (logoChanged && logo instanceof File)
        uploadEntries.push({ field: "logo", file: logo });
      if (coverImageChanged && coverImage instanceof File)
        uploadEntries.push({ field: "coverImage", file: coverImage });
      if (bannerImageChanged && bannerImage instanceof File)
        uploadEntries.push({ field: "bannerImage", file: bannerImage });
      if (coverVideoChanged && coverVideo instanceof File)
        uploadEntries.push({ field: "coverVideo", file: coverVideo });
      if (reraCertificateChanged && reraCertificate instanceof File)
        uploadEntries.push({ field: "reraCertificate", file: reraCertificate });
      if (ocCertificateChanged && ocCertificate instanceof File)
        uploadEntries.push({ field: "ocCertificate", file: ocCertificate });
      newGalleryImages.forEach((img) =>
        uploadEntries.push({ field: "galleryNewImages", file: img.file })
      );
      newLayouts.forEach((l) => {
        if (l.image instanceof File)
          uploadEntries.push({ field: "newlayoutImages", file: l.image });
      });

      const uploaded =
        uploadEntries.length > 0
          ? await uploadProjectFilesToS3(backendUrl, form.name.trim(), uploadEntries)
          : [];

      const firstUrl = (field) =>
        uploaded.find((u) => u.field === field)?.publicUrl;

      const newGalleryPaths = uploaded
        .filter((u) => u.field === "galleryNewImages")
        .map((u) => ({
          title: galleryTitleFromFile(u.file),
          image: u.publicUrl,
        }));

      const newLayoutImageUrls = uploaded
        .filter((u) => u.field === "newlayoutImages")
        .map((u) => u.publicUrl);

      let newLayoutUrlIdx = 0;
      const newLayoutsPayload = (newLayouts || []).map((l) => {
        const row = { title: l.title, area: l.area, price: l.price, image: "" };
        if (l.image instanceof File) {
          row.image = newLayoutImageUrls[newLayoutUrlIdx++] || "";
        } else if (typeof l.image === "string") {
          row.image = l.image;
        }
        return row;
      });

      const payload = {
        id,
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
        pdfChanged,
        logoChanged,
        coverImageChanged,
        bannerImageChanged,
        coverVideoChanged,
        reraCertificateChanged,
        ocCertificateChanged,
        galleryImages: galleryImages || [],
        galleryNewImages: newGalleryPaths,
        layouts: layouts || [],
        newLayouts: newLayoutsPayload,
      };

      if (pdfChanged) payload.browcherPdf = firstUrl("browcherPdf") || browcherPdf;
      if (logoChanged) payload.logo = firstUrl("logo") || logo;
      if (coverImageChanged)
        payload.coverImage = firstUrl("coverImage") || coverImage;
      if (bannerImageChanged)
        payload.bannerImage = firstUrl("bannerImage") || bannerImage;
      if (coverVideoChanged)
        payload.coverVideo = firstUrl("coverVideo") || coverVideo;
      if (reraCertificateChanged)
        payload.reraCertificate = firstUrl("reraCertificate") || reraCertificate;
      if (ocCertificateChanged)
        payload.ocCertificate = firstUrl("ocCertificate") || ocCertificate;

      const response = await axios.post(
        `${backendUrl}/api/project/updateProject`,
        payload,
        { timeout: 60_000 }
      );
      if (response.data.success) {
        toast.success("Project Updated Successfully", { autoClose: 2000 });
        navigate("/allprojects");
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating project");
    } finally {
      setSubmitting(false);
    }
  };

  if (!editableProject)
    return <p className="text-center mt-4 text-gray-300">Loading project…</p>;

  return (
    <div className="min-h-screen p-5 flex items-center justify-center bg-gray-900">
      <div className="bg-black backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-6 max-w-5xl w-full space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          ✏️ Update Project
        </h1>

        <form onSubmit={handleSubmitForm} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                required
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">Builder</label>
              <input
                type="text"
                name="builder"
                value={form.builder}
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 text-gray-200">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">Contact number</label>
              <input
                type="tel"
                name="contactNumber"
                value={form.contactNumber}
                placeholder="e.g. +91 98765 43210"
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">
                Map latitude <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                name="latitude"
                inputMode="decimal"
                placeholder="e.g. 19.2812"
                value={form.latitude}
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">
                Map longitude <span className="text-gray-500 text-xs">(optional)</span>
              </label>
              <input
                type="text"
                name="longitude"
                inputMode="decimal"
                placeholder="e.g. 72.8574"
                value={form.longitude}
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col md:col-span-2">
              <label className="mb-1 text-gray-200">RERA number</label>
              <input
                type="text"
                name="reraNo"
                value={form.reraNo}
                placeholder="e.g. P51800012345"
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">RERA possession (month)</label>
              <select
                name="reraMonth"
                value={form.reraMonth}
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
              >
                {MONTHS.map((m) => (
                  <option key={m || "none"} value={m}>
                    {m || "—"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-gray-200">RERA possession (year)</label>
              <input
                type="number"
                name="reraYear"
                value={form.reraYear}
                onChange={handleFormChange}
                className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-200">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleFormChange}
              className="p-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                placeholder="Enter feature"
                ref={inputFeatureRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === ",") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((f, i) => (
                <span
                  key={i}
                  className="bg-white text-black px-2 py-1 rounded-md flex items-center gap-2 text-sm"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFeature(f)}
                    className="text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <label className="text-gray-200">Brochure</label>
            {!pdfChanged ? (
              <span className="text-sm text-white truncate max-w-xs">
                {typeof browcherPdf === "string" ? browcherPdf : browcherPdf?.name}
              </span>
            ) : (
              <span className="text-sm text-white">{browcherPdf?.name}</span>
            )}
            <input
              type="file"
              ref={browcherPdfInputRef}
              accept="application/pdf"
              className="hidden"
              onChange={handleBrowcherChange}
            />
            <button
              type="button"
              onClick={onBrowcherButtonClick}
              className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
            >
              Replace PDF
            </button>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Logo</label>
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
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Replace logo
              </button>
              {logoChanged && logoPreview ? (
                <img src={logoPreview} className="h-24 rounded border border-gray-600" alt="" />
              ) : (
                <img
                  src={asset(logo)}
                  className="h-24 rounded border border-gray-600 object-cover"
                  alt=""
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Cover image</label>
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
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Replace cover
              </button>
              {coverImageChanged && coverImagePreview ? (
                <img
                  src={coverImagePreview}
                  className="h-24 rounded border border-gray-600 object-cover"
                  alt=""
                />
              ) : (
                <img
                  src={asset(coverImage)}
                  className="h-24 rounded border border-gray-600 object-cover"
                  alt=""
                />
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
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Replace banner
              </button>
              {bannerImageChanged && bannerImagePreview ? (
                <img
                  src={bannerImagePreview}
                  className="h-24 rounded border border-gray-600 object-cover"
                  alt=""
                />
              ) : bannerImage ? (
                <img
                  src={asset(bannerImage)}
                  className="h-24 rounded border border-gray-600 object-cover"
                  alt=""
                />
              ) : (
                <p className="text-gray-500 text-sm">No banner image</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm text-white mb-2">Cover video</label>
            <input
              type="file"
              ref={coverVideoInputRef}
              accept="video/*"
              className="hidden"
              onChange={handleCoverVideoChange}
            />
            <button
              type="button"
              onClick={() => coverVideoInputRef.current?.click()}
              className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
            >
              Replace cover video
            </button>
            {coverVideoChanged && coverVideoPreview ? (
              <video src={coverVideoPreview} className="mt-2 h-32 rounded border border-gray-600" controls />
            ) : editableProject.coverVideo ? (
              <video
                src={asset(editableProject.coverVideo)}
                className="mt-2 h-32 rounded border border-gray-600"
                controls
              />
            ) : (
              <p className="text-gray-500 text-sm mt-1">No cover video</p>
            )}
          </div>


          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white mb-2">RERA certificate</label>
              {editableProject.reraCertificate && !reraCertificateChanged && (
                <a
                  href={asset(editableProject.reraCertificate)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 text-sm block mb-2"
                >
                  Current file
                </a>
              )}
              <input
                type="file"
                ref={reraCertInputRef}
                accept=".pdf,application/pdf,image/*"
                className="hidden"
                onChange={handleReraCertChange}
              />
              <button
                type="button"
                onClick={() => reraCertInputRef.current?.click()}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Upload new
              </button>
              {reraCertificateChanged && reraCertificate && (
                <span className="ml-2 text-sm text-gray-300">{reraCertificate.name}</span>
              )}
            </div>
            <div>
              <label className="block text-sm text-white mb-2">OC certificate</label>
              {editableProject.ocCertificate && !ocCertificateChanged && (
                <a
                  href={asset(editableProject.ocCertificate)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 text-sm block mb-2"
                >
                  Current file
                </a>
              )}
              <input
                type="file"
                ref={ocCertInputRef}
                accept=".pdf,application/pdf,image/*"
                className="hidden"
                onChange={handleOcCertChange}
              />
              <button
                type="button"
                onClick={() => ocCertInputRef.current?.click()}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Upload new
              </button>
              {ocCertificateChanged && ocCertificate && (
                <span className="ml-2 text-sm text-gray-300">{ocCertificate.name}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-gray-200">Gallery</label>
              <div>
                <input
                  ref={inputGalleryRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryChange}
                />
                <button
                  type="button"
                  onClick={onGalleryButtonClick}
                  className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
                >
                  Add images
                </button>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img._id}
                  className="relative border border-gray-700 rounded-xl overflow-hidden"
                >
                  <img
                    src={asset(img.image)}
                    alt={img.title}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(img._id)}
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-red-400"
                  >
                    X
                  </button>
                </div>
              ))}
              {newGalleryImages.map((img) => (
                <div key={img.id} className="relative border border-gray-700 rounded-xl overflow-hidden">
                  <img src={img.preview} alt="" className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewGalleryImage(img.id)}
                    className="absolute top-1 right-1 bg-black/70 rounded-full p-1 text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm text-white">Layouts</label>
              <button
                type="button"
                onClick={handleAddLayout}
                className="px-5 py-2 bg-white border rounded-md text-black shadow-md hover:bg-black hover:text-white transition"
              >
                Add layout
              </button>
            </div>

            {[...layouts, ...newLayouts].map((l) => {
              const isNew = newLayouts.some((nl) => nl.id === l.id);
              const rowKey = isNew ? l.id : l._id;
              return (
                <div
                  key={rowKey}
                  className="border border-gray-700 rounded-xl p-6 bg-gray-800/70"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <label className="block text-sm mb-1 text-white">Title</label>
                      <input
                        type="text"
                        value={l.title}
                        name="title"
                        placeholder="e.g. 1 BHK, Studio, Penthouse"
                        onChange={
                          isNew
                            ? (e) => handleNewLayoutChange(l.id, e)
                            : (e) => handleLayoutChange(l._id, e)
                        }
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-white">Area</label>
                      <input
                        type="number"
                        value={l.area}
                        name="area"
                        onChange={
                          isNew
                            ? (e) => handleNewLayoutChange(l.id, e)
                            : (e) => handleLayoutChange(l._id, e)
                        }
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-white">Price</label>
                      <input
                        type="number"
                        value={l.price}
                        name="price"
                        onChange={
                          isNew
                            ? (e) => handleNewLayoutChange(l.id, e)
                            : (e) => handleLayoutChange(l._id, e)
                        }
                        className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-2 text-white"
                      />
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`layoutInput-${rowKey}`}
                    onChange={
                      isNew
                        ? (e) => handleNewLayoutImageChange(l.id, e)
                        : (e) => handleLayoutImageChange(l._id, e)
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById(`layoutInput-${rowKey}`).click()
                    }
                    className="px-5 py-2 bg-white border rounded-md text-black mb-2"
                  >
                    {isNew ? "Change image" : "Change image"}
                  </button>
                  {(l.imagePreview || l.image) && (
                    <img
                      src={
                        l.imagePreview ||
                        (typeof l.image === "string"
                          ? asset(l.image)
                          : "")
                      }
                      alt=""
                      className="w-40 h-40 object-cover rounded-xl border border-gray-600 mb-2"
                    />
                  )}
                  <button
                    type="button"
                    onClick={
                      isNew
                        ? () => removeNewLayout(l.id)
                        : () => removeLayout(l._id)
                    }
                    className="px-5 py-2 bg-red-500 border rounded-md text-black"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={discard}
              className="px-5 py-2 bg-red-500 border rounded-md text-black"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-yellow-200 border rounded-md text-black"
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProject;
