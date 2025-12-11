import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userMenuTimeout, setUserMenuTimeout] = useState(null);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleShopNav = (event) => {
    event?.preventDefault();

    if (window.location.pathname === "/shop") {
      window.dispatchEvent(new Event("shop:resetFilters"));
    }

    setIsMenuOpen(false);
    navigate("/shop", {
      state: { resetFilters: true, ts: Date.now() },
    });
  };

  const handleUserMenuEnter = () => {
    if (userMenuTimeout) {
      clearTimeout(userMenuTimeout);
      setUserMenuTimeout(null);
    }
    setIsUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    const timeout = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 500);
    setUserMenuTimeout(timeout);
  };

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <header className="bg-off-white/95 dark:bg-dark-grey/95 backdrop-blur-md border-b border-warm-grey/30 dark:border-muted-slate/30 sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/logo.webp"
              alt="Flipcard Logo"
              className="h-10 w-auto object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span
                className="text-xl lg:text-2xl font-semibold text-dark-grey dark:text-off-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Flipcard
              </span>
              <span className="text-[9px] tracking-wider text-dark-grey/50 dark:text-off-white/50 uppercase">
                D'Florencis
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="text-dark-grey dark:text-off-white hover:text-soft-teal transition text-sm"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={handleShopNav}
              className="text-dark-grey dark:text-off-white hover:text-soft-teal transition text-sm"
            >
              Shop
            </Link>
            <Link
              to="/collection"
              className="text-dark-grey hover:text-soft-teal transition text-sm"
            >
              Collection
            </Link>
            {/* <Link
              to="/contact"
              className="text-dark-grey hover:text-soft-teal transition text-sm"
            >
              Contact
            </Link> */}
            {isAdmin() && (
              <Link
                to="/admin"
                className="text-dark-grey hover:text-soft-teal transition text-sm"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="text-dark-grey dark:text-off-white hover:text-soft-teal transition"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-dark-grey dark:text-off-white hover:text-soft-teal dark:hover:text-soft-teal transition p-2 rounded-lg hover:bg-warm-grey/10"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Cart Icon with Count */}
            <Link
              to="/cart"
              className="flex items-center gap-1.5 text-dark-grey dark:text-off-white hover:text-soft-teal dark:hover:text-soft-teal transition group"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart size={20} />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[10px] text-dark-grey/60 dark:text-off-white/60 group-hover:text-soft-teal">
                  Cart
                </span>
                <span className="text-xs font-semibold text-dark-grey dark:text-off-white group-hover:text-soft-teal">
                  {getCartCount()} {getCartCount() === 1 ? "item" : "items"}
                </span>
              </div>
            </Link>

            {/* User Icon or Login Button */}
            {user ? (
              <div
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button
                  className="text-dark-grey dark:text-off-white hover:text-soft-teal transition"
                  aria-label="User Menu"
                >
                  <User size={20} />
                </button>
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-off-white dark:bg-muted-slate rounded-xl py-2 border-2 border-dark-grey/20 dark:border-off-white/20 z-[60]"
                    style={{
                      boxShadow: "0 10px 40px rgba(57, 61, 63, 0.3)",
                      animation: "slideDown 0.2s ease-out",
                    }}
                  >
                    <div className="px-4 py-3 border-b-2 border-dark-grey/20 dark:border-off-white/20 mb-1 bg-warm-grey dark:bg-dark-grey">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "#393D3F", opacity: 1 }}
                      >
                        {user.name}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "#546A7B", opacity: 1 }}
                      >
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2.5 text-sm hover:bg-soft-teal/20 hover:text-soft-teal transition-colors font-medium"
                      style={{ color: "#393D3F", opacity: 1 }}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2.5 text-sm hover:bg-soft-teal/20 hover:text-soft-teal transition-colors font-medium"
                      style={{ color: "#393D3F", opacity: 1 }}
                    >
                      Orders
                    </Link>
                    <div className="border-t-2 border-dark-grey/20 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2.5 text-sm text-dark-grey dark:text-off-white hover:bg-dark-grey/10 dark:hover:bg-off-white/10 transition-colors font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm text-soft-teal dark:text-soft-teal border border-soft-teal dark:border-soft-teal rounded hover:bg-soft-teal hover:text-off-white transition"
                aria-label="Login"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-dark-grey dark:text-off-white hover:text-soft-teal transition"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="pb-3 pt-1 border-t border-warm-grey/30 dark:border-muted-slate/30">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg bg-warm-grey/10 dark:bg-muted-slate/20 text-dark-grey dark:text-off-white placeholder-muted-slate dark:placeholder-off-white/50 focus:outline-none focus:ring-2 focus:ring-soft-teal border border-warm-grey/30 dark:border-muted-slate/30"
                autoFocus
              />
              <Search
                className="absolute right-3 top-2.5 text-muted-slate dark:text-off-white/70"
                size={20}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-3 pt-1 space-y-1 border-t border-warm-grey/30 dark:border-muted-slate/30">
            <Link
              to="/"
              onClick={toggleMenu}
              className="block py-2 px-2 text-dark-grey dark:text-off-white hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={handleShopNav}
              className="block py-2 px-2 text-dark-grey dark:text-off-white hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              to="/collection"
              onClick={toggleMenu}
              className="block py-2 px-2 text-dark-grey dark:text-off-white hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Collection
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="block py-2 px-2 text-dark-grey dark:text-off-white hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Contact
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                onClick={toggleMenu}
                className="block py-2 px-2 text-dark-grey dark:text-off-white hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
              >
                Admin
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
