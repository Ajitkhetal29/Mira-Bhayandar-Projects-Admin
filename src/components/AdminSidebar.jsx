import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppConetxt } from "../context/context";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/allProjects", label: "Projects" },
  { to: "/allBlogs", label: "Blogs" },
  { to: "/allTestimonials", label: "Testimonials" },
  { to: "/allFaq", label: "FAQ" },
  { to: "/allLeads", label: "Leads" },
  { to: "/contactSettings", label: "Contact" },
];

const linkClass = ({ isActive }) =>
  `admin-nav-link${isActive ? " is-active" : ""}`;

export default function AdminSidebar({ mobileOpen, onNavigate }) {
  const { logout } = useContext(AppConetxt);

  return (
    <aside
      className={`admin-sidebar${mobileOpen ? " is-open" : ""}`}
      aria-label="Admin navigation"
    >
      <div className="flex flex-col h-full px-3 py-5">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 px-2 mb-6"
          onClick={onNavigate}
        >
          <img
            src="/img/logo/logo.png"
            alt="Mira Bhayandar Projects"
            className="h-9 w-auto"
          />
        </NavLink>

        <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-widest text-cream-muted/70">
          Menu
        </p>

        <nav className="flex flex-col gap-0.5 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClass}
              onClick={onNavigate}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="admin-btn-danger w-full mt-4"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
