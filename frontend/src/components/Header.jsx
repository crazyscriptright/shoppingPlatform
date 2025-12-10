import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userMenuTimeout, setUserMenuTimeout] = useState(null);
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { getCartCount } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

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
    <header className="bg-off-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col leading-tight flex-shrink-0">
            <span
              className="text-xl lg:text-2xl font-semibold text-dark-grey"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Flipcard
            </span>
            <span className="text-[9px] tracking-wider text-dark-grey/50 uppercase">
              D'Florencis
            </span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              to="/"
              className="text-dark-grey hover:text-soft-teal transition text-sm"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-dark-grey hover:text-soft-teal transition text-sm"
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
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Search Icon */}
            <button
              onClick={toggleSearch}
              className="text-dark-grey hover:text-soft-teal transition"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative text-dark-grey hover:text-soft-teal transition"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-soft-teal text-off-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Icon or Login Button */}
            {user ? (
              <div
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button
                  className="text-dark-grey hover:text-soft-teal transition"
                  aria-label="User Menu"
                >
                  <User size={20} />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200 transition-opacity duration-200 ${
                    isUserMenuOpen
                      ? "opacity-100 visible"
                      : "opacity-0 invisible"
                  }`}
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-dark-grey truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-dark-grey/60 truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-xs text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition"
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-xs text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition"
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-xs text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm text-soft-teal border border-soft-teal rounded hover:bg-soft-teal hover:text-off-white transition"
                aria-label="Login"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-dark-grey hover:text-soft-teal transition"
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (Expandable) */}
        {isSearchOpen && (
          <div className="pb-3 pt-1 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg bg-gray-50 text-dark-grey placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-soft-teal border border-gray-200"
                autoFocus
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden pb-3 pt-1 space-y-1 border-t border-gray-200">
            <Link
              to="/"
              onClick={toggleMenu}
              className="block py-2 px-2 text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={toggleMenu}
              className="block py-2 px-2 text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Shop
            </Link>
            <Link
              to="/collection"
              onClick={toggleMenu}
              className="block py-2 px-2 text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Collection
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="block py-2 px-2 text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
            >
              Contact
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                onClick={toggleMenu}
                className="block py-2 px-2 text-dark-grey hover:bg-soft-teal/10 hover:text-soft-teal transition rounded text-sm font-medium"
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
