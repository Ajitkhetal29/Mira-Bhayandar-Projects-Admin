import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="admin-shell">
      {mobileOpen ? (
        <button
          type="button"
          className="admin-sidebar-overlay md:hidden"
          aria-label="Close menu"
          onClick={closeMobile}
        />
      ) : null}

      <AdminSidebar mobileOpen={mobileOpen} onNavigate={closeMobile} />

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-btn-ghost"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            ☰ Menu
          </button>
          <img
            src="/img/logo/logo.png"
            alt=""
            className="h-8 w-auto opacity-90"
          />
        </header>

        <div className="admin-main-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
