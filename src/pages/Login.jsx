import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppConetxt } from "../context/context";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, navigate, setToken } = useContext(AppConetxt);

  const [needsBootstrap, setNeedsBootstrap] = useState(null);
  const [formData, setFormdata] = useState({
    secret: "",
    username: "",
    password: "",
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/bootstrap`);
        if (!cancelled && data.success) setNeedsBootstrap(data.needsBootstrap);
      } catch {
        if (!cancelled) setNeedsBootstrap(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/login`,
        formData
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("Logged In Successfully", { autoClose: 2000 });
        navigate("/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(msg);
    }
  };

  const handleBootstrap = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/admin/setup`, {
        secret: formData.secret,
        username: formData.username,
        password: formData.password,
      });
      if (response.data.success) {
        toast.success(response.data.message, { autoClose: 3000 });
        setNeedsBootstrap(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || error.message || "Setup failed";
      toast.error(msg);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  if (needsBootstrap === null) {
    return (
      <div className="admin-login-shell">
        <p className="text-cream-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <img
          alt="Mira Bhayandar Projects"
          src="/img/logo/logo.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-8 text-center text-2xl font-semibold text-cream font-[family-name:var(--font-heading)]">
          {needsBootstrap ? "First admin" : "Admin Login"}
        </h2>

        <form
          onSubmit={needsBootstrap ? handleBootstrap : handleSubmit}
          className="mt-8 space-y-5"
        >
          {needsBootstrap && (
            <div>
              <label htmlFor="secret" className="admin-label">
                PIN
              </label>
              <input
                id="secret"
                name="secret"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                required
                placeholder="1234"
                onChange={handleForm}
                className="admin-input"
              />
            </div>
          )}
          <div>
            <label htmlFor="username" className="admin-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              placeholder="Enter username"
              onChange={handleForm}
              className="admin-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="admin-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              required
              onChange={handleForm}
              className="admin-input"
            />
          </div>
          <button type="submit" className="admin-btn-primary w-full">
            {needsBootstrap ? "Create account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
