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
      <div className="admin-page flex min-h-[40vh] items-center justify-center">
        <p className="text-cream-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="admin-page max-w-2xl">
      <header className="admin-page-header">
        <h1 className="admin-page-title">Contact section</h1>
        <p className="admin-page-subtitle">
          These values power the public site: the two phone lines and the
          WhatsApp button. Use any format for phones (e.g.{" "}
          <code className="text-gold">+91 98765 43210</code>). WhatsApp must be
          digits only with country code, no plus sign (e.g.{" "}
          <code className="text-gold">919876543210</code>).
        </p>
      </header>

      <form onSubmit={handleSubmit} className="admin-card space-y-5 p-6">
        <div>
          <label className="admin-label" htmlFor="phone1">
            Phone 1 (display)
          </label>
          <input
            id="phone1"
            name="phone1"
            type="text"
            value={form.phone1}
            onChange={onChange}
            className="admin-input"
            placeholder="+91 98765 43210"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="phone2">
            Phone 2 (display)
          </label>
          <input
            id="phone2"
            name="phone2"
            type="text"
            value={form.phone2}
            onChange={onChange}
            className="admin-input"
            placeholder="+91 98765 43211"
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="whatsapp">
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
            className="admin-input"
            placeholder="919876543210"
          />
        </div>
        <button type="submit" className="admin-btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
