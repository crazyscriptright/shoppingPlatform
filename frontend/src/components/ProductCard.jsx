import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`}>
      <div
        className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image || "/placeholder-product.jpg"}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 left-3 bg-soft-teal text-off-white px-3 py-1 rounded-full text-xs font-semibold">
              {product.discount}% OFF
            </div>
          )}

          {/* New Badge */}
          {product.isNew && (
            <div className="absolute top-3 right-3 bg-dark-grey text-off-white px-3 py-1 rounded-full text-xs font-semibold">
              NEW
            </div>
          )}

          {/* Hover Actions */}
          <div
            className={`absolute inset-0 bg-dark-grey bg-opacity-40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              onClick={handleAddToCart}
              className="bg-soft-teal text-off-white p-2.5 rounded-full hover:bg-opacity-90 transition shadow-lg"
              title="Add to Cart"
            >
              <ShoppingCart size={18} />
            </button>
            <button
              className="bg-off-white text-dark-grey p-2.5 rounded-full hover:bg-opacity-90 transition shadow-lg"
              title="Quick View"
            >
              <Eye size={18} />
            </button>
            <button
              className="bg-off-white text-dark-grey p-2.5 rounded-full hover:bg-opacity-90 transition shadow-lg"
              title="Add to Wishlist"
            >
              <Heart size={18} />
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-dark-grey bg-opacity-70 flex items-center justify-center">
              <span className="text-off-white text-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-dark-grey font-semibold text-base mb-1 truncate">
            {product.name}
          </h3>

          <p className="text-dark-grey/60 text-xs mb-2 truncate capitalize">
            {product.category}
          </p>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-dark-grey font-bold text-lg">
                ${parseFloat(product.price || 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-dark-grey/50 text-sm line-through">
                  ${parseFloat(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-1">
                <span className="text-soft-teal">★</span>
                <span className="text-dark-grey text-sm">{product.rating}</span>
              </div>
            )}
          </div>

          {/* Stock Warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-soft-teal text-xs mt-2">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
