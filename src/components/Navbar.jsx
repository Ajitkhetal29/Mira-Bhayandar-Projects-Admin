import { useState, useEffect, useContext } from "react";
import { AppConetxt } from "../context/context";
import { NavLink } from "react-router-dom";

// --- Improvement: Extracted NavLink classes for better readability ---
const navLinkClasses = "block md:inline-block py-2 md:py-0 transition-colors duration-300 hover:text-yellow-300";
const activeNavLinkClasses = "text-yellow-300";
const inactiveNavLinkClasses = "text-white";

const getNavLinkClass = ({ isActive }) => 
  `${navLinkClasses} ${isActive ? activeNavLinkClasses : inactiveNavLinkClasses}`;

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { logout } = useContext(AppConetxt);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { to: "/dashboard", text: "Dashboard" },
    { to: "/allProjects", text: "Projects" },
    { to: "/allBlogs", text: "Blogs" },
    { to: "/allTestimonials", text: "Testimonials" },
    { to: "/allFaq", text: "FAQ" },
    { to: "/allLeads", text: "Leads" },
    { to: "/contactSettings", text: "Contact" },
  ];

  return (
    <header
      id="siteHeader"
      
      className={` top-0 left-0 z-50 w-full transition-colors duration-300 ${
        scrolled || mobileOpen ? "fixed bg-black" : "bg-black/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        <NavLink
          to="/dashboard"
          className="text-2xl font-bold text-white flex items-center"
        >
          <img
            src="/img/logo/logo.png"
            alt="logo"
            className="h-10 w-auto" // Removed max-w, as w-auto should suffice
          />
        </NavLink>

        {/* --- Desktop Navigation --- */}
        <ul className="hidden md:flex items-center space-x-8 font-medium">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={getNavLinkClass}>
                {link.text}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* --- Improvement: Logout button hidden on mobile, better styling --- */}
        <button
          onClick={logout}
          className="hidden md:inline-block bg-red-600 text-white px-4 py-2 rounded-md font-semibold cursor-pointer transition-colors duration-300 hover:bg-red-700"
        >
          Logout
        </button>

        {/* --- Improvement: Hamburger/Close Icon --- */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white text-3xl z-50"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <>&#x2715;</> : <>&#9776;</>}
        </button>
      </nav>

      {/* --- Improvement: Animated Mobile Menu --- */}
      <div
        className={`md:hidden text-center shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 pb-4 flex flex-col space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={getNavLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {link.text}
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              setMobileOpen(false);
            }}
            className="w-full bg-red-600 text-white px-4 py-2 mt-2 rounded-md font-semibold cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;