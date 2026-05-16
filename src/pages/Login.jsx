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
      <div className="flex flex-1 min-h-screen justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 justify-center items-center bg-gradient-to-br
              from-gray-100 to-gray-200 p-4"
    >
      <div
        className="flex flex-col w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl
                justify-center items-center px-6 py-12 lg:px-8"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/img/logo/logo.png"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold text-white oswald_span">
            {needsBootstrap ? "First admin" : "Admin Login"}
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm w-full">
          <form
            onSubmit={needsBootstrap ? handleBootstrap : handleSubmit}
            className="space-y-6"
          >
            {needsBootstrap && (
              <div>
                <label
                  htmlFor="secret"
                  className="block font-bold text-sm/6 text-gray-100 maven-pro"
                >
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
                  className="mt-2 block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="username"
                className="block font-bold text-sm/6 text-gray-100 maven-pro"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Enter Username"
                  onChange={handleForm}
                  className="block w-full cursor-pointer italic rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-bold text-gray-100 maven-pro"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  required
                  onChange={handleForm}
                  className="block w-full cursor-pointer italic rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full cursor-pointer maven-pro justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                {needsBootstrap ? "Create account" : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
