import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RefreshCw,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);

      // Fetch related products
      if (response.data.category) {
        const relatedResponse = await api.get(
          `/products?category=${response.data.category}&limit=4`
        );
        setRelatedProducts(
          relatedResponse.data.products?.filter((p) => p.id !== parseInt(id)) ||
            []
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      setToastMessage("Please login to add items to cart");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 2000);
      return;
    }

    if (product) {
      const success = await addToCart(product, quantity);
      if (success) {
        setToastMessage(
          `${quantity} ${quantity > 1 ? "items" : "item"} added to cart!`
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage("Failed to add to cart. Please try again.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const handleToggleWishlist = () => {
    if (!user) {
      setToastMessage("Please login to add items to wishlist");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 2000);
      return;
    }

    if (product) {
      const success = toggleWishlist(product);
      if (success) {
        const inWishlist = isInWishlist(product.id);
        setToastMessage(
          inWishlist ? "Removed from wishlist" : "Added to wishlist!"
        );
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-teal"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-dark-grey mb-4">
          Product Not Found
        </h2>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-off-white py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <Link to="/" className="text-muted-slate hover:text-soft-teal">
            Home
          </Link>
          <span className="mx-2 text-muted-slate">&gt;</span>
          <Link to="/shop" className="text-muted-slate hover:text-soft-teal">
            Shop
          </Link>
          <span className="mx-2 text-muted-slate">&gt;</span>
          <span className="text-dark-grey">{product.name}</span>
        </nav>

        {/* Product Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative bg-warm-grey rounded-lg overflow-hidden aspect-square mb-4">
              <img
                src={images[selectedImage] || "/placeholder-product.jpg"}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-off-white p-2 rounded-full hover:bg-soft-teal hover:text-off-white transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((selectedImage + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-off-white p-2 rounded-full  hover:bg-soft-teal hover:text-off-white transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border ${
                      selectedImage === index
                        ? "border-soft-teal"
                        : "border-warm-grey"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-dark-grey mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-soft-teal">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    fill={
                      i < Math.floor(product.rating || 0)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
              <span className="text-muted-slate">
                ({product.reviews || 0} Reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-dark-grey">
                ₹{parseFloat(product.price || 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-muted-slate line-through">
                  ₹{parseFloat(product.originalPrice).toFixed(2)}
                </span>
              )}
              {product.discount && (
                <span className="bg-soft-teal text-off-white px-3 py-1 rounded text-sm font-semibold">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-slate mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-soft-teal font-semibold">
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-red-500 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-dark-grey font-semibold mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-warm-grey/10 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-2 hover:bg-warm-grey transition"
                  >
                    -
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-2 hover:bg-warm-grey transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                size="lg"
                fullWidth
                disabled={product.stock === 0}
                className="flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
              <button
                onClick={handleToggleWishlist}
                className={`p-4 rounded-lg transition ${
                  isInWishlist(product.id)
                    ? "bg-soft-teal text-off-white"
                    : "bg-warm-grey hover:bg-soft-teal hover:text-off-white"
                }`}
              >
                <Heart
                  size={24}
                  fill={isInWishlist(product.id) ? "currentColor" : "none"}
                />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-4 border-t border-warm-grey pt-6">
              <div className="flex items-center gap-3">
                <Truck className="text-soft-teal" size={24} />
                <div>
                  <p className="font-semibold text-dark-grey">Free Shipping</p>
                  <p className="text-sm text-muted-slate">On orders over ₹50</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCw className="text-soft-teal" size={24} />
                <div>
                  <p className="font-semibold text-dark-grey">30-Day Returns</p>
                  <p className="text-sm text-muted-slate">Easy return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="text-soft-teal" size={24} />
                <div>
                  <p className="font-semibold text-dark-grey">Secure Payment</p>
                  <p className="text-sm text-muted-slate">
                    100% secure transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-8 right-8 bg-soft-teal text-off-white px-6 py-4 rounded-lg z-50 animate-slide-up">
            <p className="font-semibold">{toastMessage}</p>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-dark-grey mb-8">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
