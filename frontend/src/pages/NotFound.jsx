import { Link } from "react-router-dom";
import { Home, Search, Package } from "lucide-react";
import Button from "../components/Button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1
            className="text-9xl md:text-[12rem] font-bold text-soft-teal/20"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <Package
              className="text-muted-slate/30"
              size={120}
              strokeWidth={1.5}
            />
            <Search
              className="absolute bottom-0 right-0 text-soft-teal"
              size={40}
            />
          </div>
        </div>

        {/* Message */}
        <h2
          className="text-3xl md:text-4xl font-normal text-dark-grey mb-4"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Page Not Found
        </h2>
        <p className="text-lg text-dark-grey/70 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for seems to have wandered off. Let's
          get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="flex items-center gap-2 min-w-[200px]">
              <Home size={20} />
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button
              variant="outline"
              className="flex items-center gap-2 min-w-[200px]"
            >
              <Package size={20} />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-dark-grey/10">
          <p className="text-sm text-dark-grey/60 mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              to="/shop"
              className="text-soft-teal hover:text-dark-grey transition"
            >
              Shop
            </Link>
            <span className="text-dark-grey/30">•</span>
            <Link
              to="/collection"
              className="text-soft-teal hover:text-dark-grey transition"
            >
              Collections
            </Link>
            <span className="text-dark-grey/30">•</span>
            <Link
              to="/cart"
              className="text-soft-teal hover:text-dark-grey transition"
            >
              Cart
            </Link>
            <span className="text-dark-grey/30">•</span>
            <Link
              to="/account"
              className="text-soft-teal hover:text-dark-grey transition"
            >
              Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
