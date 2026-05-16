import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppConetxt } from "../context/context";

const emptyForm = {
  phone1: "",
  phone2: "",
  whatsapp: "",
};

export default function ContactSettings() {
  const { backendUrl, token } = useContext(AppConetxt);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/contact/settings`);
        if (cancelled) return;
        if (data?.success && data.settings) {
          setForm({
            phone1: data.settings.phone1 ?? "",
            phone2: data.settings.phone2 ?? "",
            whatsapp: data.settings.whatsapp ?? "",
          });
        }
      } catch (e) {
        toast.error(e.response?.data?.message || "Could not load settings");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [backendUrl]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = token || localStorage.getItem("token");
    if (!auth) {
      toast.error("Not logged in");
      return;
    }
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/contact/settings`,
        form,
        { headers: { Authorization: `Bearer ${auth}` } }
      );
      if (data.success) {
        toast.success(data.message || "Saved");
        if (data.settings) {
          setForm({
            phone1: data.settings.phone1 ?? "",
            phone2: data.settings.phone2 ?? "",
            whatsapp: data.settings.whatsapp ?? "",
          });
        }
      } else {
        toast.error(data.message || "Save failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 pt-28 text-white">
        <div className="mx-auto max-w-2xl px-4 py-10">Loading…</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 pt-28 text-white">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="mb-2 border-b border-neutral-800 pb-4 text-3xl font-extrabold md:text-4xl">
          Contact section
        </h1>
        <p className="mb-8 text-sm text-gray-400 md:text-base">
          These values power the public site: the two phone lines and the WhatsApp
          button. Use any format for phones (e.g. <code className="text-amber-200/90">+91 98765 43210</code>
          ). WhatsApp must be digits only with country code, no plus sign (e.g.{" "}
          <code className="text-amber-200/90">919876543210</code>).
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border border-neutral-800 bg-neutral-900 p-6"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="phone1">
              Phone 1 (display)
            </label>
            <input
              id="phone1"
              name="phone1"
              type="text"
              value={form.phone1}
              onChange={onChange}
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-gray-500"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="phone2">
              Phone 2 (display)
            </label>
            <input
              id="phone2"
              name="phone2"
              type="text"
              value={form.phone2}
              onChange={onChange}
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-gray-500"
              placeholder="+91 98765 43211"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300" htmlFor="whatsapp">
              WhatsApp number
            </label>
            <input
              id="whatsapp"
              name="whatsapp"
              type="text"
              inputMode="numeric"
              value={form.whatsapp}
              onChange={onChange}
              required
              className="w-full rounded-md border border-neutral-700 bg-neutral-800 px-3 py-2 text-white placeholder:text-gray-500"
              placeholder="919876543210"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
          >
            Save
          </button>
        </form>
      </div>
    </main>
  );
}
