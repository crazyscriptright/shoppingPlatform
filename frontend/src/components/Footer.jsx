import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-8 relative z-10 ">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div>
            <h3
              className="text-xl font-semibold mb-3 text-dark-grey"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Flipcard
            </h3>
            <p className="text-dark-grey/60 mb-3 text-xs leading-relaxed">
              Your one-stop destination for premium fashion and accessories.
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="text-dark-grey hover:text-soft-teal transition"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="text-dark-grey hover:text-soft-teal transition"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="text-dark-grey hover:text-soft-teal transition"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="text-dark-grey hover:text-soft-teal transition"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-dark-grey">Shop</h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/shop?category=women"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=men"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=accessories"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?sale=true"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-dark-grey">
              Customer Service
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/contact"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-dark-grey/60 hover:text-soft-teal transition text-xs"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-dark-grey">
              Newsletter
            </h4>
            <p className="text-dark-grey/60 mb-3 text-xs leading-relaxed">
              Subscribe to get special offers.
            </p>
            <div className="flex max-w-xs">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-1.5 rounded-l-md bg-gray-50 text-dark-grey placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-soft-teal border border-gray-200 text-xs min-w-0"
              />
              <button className="bg-soft-teal px-3 py-1.5 rounded-r-md hover:bg-opacity-90 transition text-off-white flex-shrink-0">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-dark-grey/60 text-xs">
            © 2025 Flipcard. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              to="/privacy"
              className="text-dark-grey/60 hover:text-soft-teal text-xs transition"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-dark-grey/60 hover:text-soft-teal text-xs transition"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
