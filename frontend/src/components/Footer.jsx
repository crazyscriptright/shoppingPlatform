import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-warm-grey/30 dark:border-muted-slate/30 pt-6 pb-4 relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="py-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-x-8 sm:gap-y-10">
          {/* Brand Section */}
          <div className="col-span-2 lg:col-span-1">
            <h3
              className="text-lg sm:text-xl font-semibold mb-3 text-dark-grey dark:text-off-white transition-colors"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Flipcard
            </h3>
            <p className="text-dark-grey/60 dark:text-off-white/60 mb-4 text-sm sm:text-xs leading-relaxed max-w-xs transition-colors">
              Your one-stop destination for premium fashion and accessories.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-dark-grey dark:text-off-white hover:text-soft-teal transition-colors p-2 hover:bg-warm-grey/10 dark:hover:bg-muted-slate/20 rounded-full"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-dark-grey dark:text-off-white hover:text-soft-teal transition-colors p-2 hover:bg-warm-grey/10 dark:hover:bg-muted-slate/20 rounded-full"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-dark-grey dark:text-off-white hover:text-soft-teal transition-colors p-2 hover:bg-warm-grey/10 dark:hover:bg-muted-slate/20 rounded-full"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="text-dark-grey dark:text-off-white hover:text-soft-teal transition-colors p-2 hover:bg-warm-grey/10 dark:hover:bg-muted-slate/20 rounded-full"
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="col-span-1">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-dark-grey dark:text-off-white transition-colors">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop?category=women"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=men"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=accessories"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?sale=true"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="col-span-1">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-dark-grey dark:text-off-white transition-colors">
              Customer Service
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal transition-colors text-sm inline-block"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4 text-dark-grey dark:text-off-white transition-colors">
              Newsletter
            </h4>
            <p className="text-dark-grey/60 dark:text-off-white/60 mb-3 text-sm leading-relaxed transition-colors">
              Subscribe to get special offers.
            </p>
            <div className="flex max-w-sm">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-l-md bg-warm-grey/10 dark:bg-muted-slate/20 text-dark-grey dark:text-off-white placeholder-muted-slate dark:placeholder-off-white/50 focus:outline-none focus:ring-2 focus:ring-soft-teal border border-warm-grey/30 dark:border-muted-slate/30 text-sm min-w-0 transition-colors"
              />
              <button
                className="bg-soft-teal px-4 py-2.5 rounded-r-md hover:bg-opacity-90 transition-colors text-off-white flex-shrink-0"
                aria-label="Subscribe"
              >
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-grey/30 dark:border-muted-slate/30 py-5 mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors">
          <p className="text-dark-grey/60 dark:text-off-white/60 text-xs sm:text-sm text-center sm:text-left transition-colors">
            © 2025 Flipcard. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link
              to="/privacy"
              className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal text-xs sm:text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-dark-grey/60 dark:text-off-white/60 hover:text-soft-teal text-xs sm:text-sm transition-colors"
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
