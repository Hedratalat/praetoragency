import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Services", to: "/services" },
    { name: "Portfolio", to: "/portfolio" },
    { name: "Pricing", to: "/pricing" },
    { name: "Blog", to: "/blog" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-bodyBg/80 backdrop-blur-lg  mt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 border-b border-gray-700">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="group">
            <div
              className="flex items-center gap-2 bg-gradient-to-br from-emerald-500 to-lime-400 px-5 py-2 rounded-xl 
            shadow-md group-hover:shadow-lg transition"
            >
              <span className="text-black font-extrabold text-lg  whitespace-nowrap">
                Praetor
              </span>
              <span className="text-black font-extrabold text-lg  sm:inline ">
                Agency
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-8 font-heading font-semibold text-whitePure text-lg">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className={`
                      relative transition-all duration-300
                      ${isActive ? "text-primary" : "hover:text-primary"}
                      after:absolute after:left-0 after:-bottom-1
                      after:h-[2px] after:bg-primary
                      after:w-full
                      ${
                        isActive ? "after:opacity-100" : "after:opacity-0"
                      } after:transition-all after:duration-300
                      hover:after:w-full
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-lg text-whitePure hover:text-primary transition"
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col items-center gap-6 py-6 bg-cardBg rounded-2xl mt-3 font-heading font-semibold text-lg">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    onClick={() => {
                      setMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`
                      relative transition-all duration-300
                      ${isActive ? "text-primary" : "hover:text-primary"}
                      after:absolute after:left-0 after:-bottom-1
                      after:h-[2px] after:bg-primary
                      after:w-full
                      ${isActive ? "after:opacity-100" : "after:opacity-0"}
                      after:transition-all after:duration-300
                      hover:after:w-full
                    `}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
