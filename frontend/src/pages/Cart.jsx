import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import Button from "../components/Button";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-dark-grey dark:text-off-white mb-4 transition-colors">
            Your Cart is Empty
          </h2>
          <p className="text-muted-slate dark:text-off-white/70 mb-8 transition-colors">
            Add some products to get started!
          </p>
          <Link to="/shop">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <Link
            to="/"
            className="text-muted-slate dark:text-off-white/70 hover:text-soft-teal transition-colors"
          >
            Home
          </Link>
          <span className="mx-2 text-muted-slate dark:text-off-white/70 transition-colors">
            &gt;
          </span>
          <Link
            to="/shop"
            className="text-muted-slate dark:text-off-white/70 hover:text-soft-teal transition-colors"
          >
            Shop
          </Link>
          <span className="mx-2 text-muted-slate dark:text-off-white/70 transition-colors">
            &gt;
          </span>
          <span className="text-dark-grey dark:text-off-white transition-colors">
            Cart
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-dark-grey dark:text-off-white transition-colors">
            Your Cart
          </h1>
          <Link
            to="/shop"
            className="flex items-center gap-2 text-soft-teal hover:underline transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-warm-grey dark:bg-muted-slate rounded-lg p-6 flex gap-6 transition-colors"
              >
                {/* Product Image */}
                <div className="w-32 h-32 bg-off-white dark:bg-[#1a1d1e] rounded-lg overflow-hidden flex-shrink-0 transition-colors">
                  <img
                    src={item.image || "/placeholder-product.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        to={`/product/${item.id}`}
                        className="text-xl font-semibold text-dark-grey dark:text-off-white hover:text-soft-teal transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-muted-slate dark:text-off-white/70 text-sm transition-colors">
                        {item.category}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-slate dark:text-off-white/70 hover:text-dark-grey dark:hover:text-off-white transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center bg-warm-grey/10 dark:bg-[#1a1d1e]/50 rounded-lg transition-colors">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="px-3 py-1 hover:bg-off-white dark:hover:bg-muted-slate transition-colors text-dark-grey dark:text-off-white"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 font-semibold text-dark-grey dark:text-off-white transition-colors">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-1 hover:bg-off-white transition"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-dark-grey dark:text-off-white transition-colors">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-slate dark:text-off-white/70 transition-colors">
                        ₹{parseFloat(item.price).toFixed(2)} each
                      </p>
                    </div>
                  </div>

                  {/* Stock Warning */}
                  {item.quantity >= item.stock && (
                    <p className="text-red-500 text-sm mt-2">
                      Maximum stock reached
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-center">
              <Button
                onClick={clearCart}
                variant="outline"
                className="w-48 text-muted-slate border-muted-slate hover:bg-muted-slate hover:text-off-white"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-warm-grey dark:bg-muted-slate rounded-lg p-6 sticky top-24 transition-colors">
              <h2 className="text-2xl font-bold text-dark-grey dark:text-off-white mb-6 transition-colors">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-slate text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-slate text-sm">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-slate text-sm">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                {subtotal < 50 && (
                  <div className="bg-soft-teal bg-opacity-20 text-soft-teal p-3 rounded text-sm">
                    Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                  </div>
                )}

                <div className="border-t border-muted-slate dark:border-muted-slate/50 pt-4 transition-colors">
                  <div className="flex justify-between text-dark-grey dark:text-off-white text-xl font-bold transition-colors">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleCheckout}
                  size="lg"
                  fullWidth
                  className="mt-6 w-48 text-soft-teal hover:text-dark-grey transition-colors"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
