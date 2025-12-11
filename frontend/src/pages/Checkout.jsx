import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail as MailIcon } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import RazorpayCheckout from "../components/RazorpayCheckout";

const Checkout = () => {
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  });

  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = () => {
    return (
      shippingAddress.full_name &&
      shippingAddress.email &&
      shippingAddress.phone &&
      shippingAddress.address_line1 &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.postal_code
    );
  };

  if (cart.length === 0 && !paymentSuccess) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-dark-grey dark:text-off-white mb-4 transition-colors">
            Your Cart is Empty
          </h2>
          <p className="text-muted-slate dark:text-off-white/70 mb-8 transition-colors">
            Add some products to checkout!
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
            to="/cart"
            className="text-muted-slate dark:text-off-white/70 hover:text-soft-teal transition-colors"
          >
            Cart
          </Link>
          <span className="mx-2 text-muted-slate dark:text-off-white/70 transition-colors">
            &gt;
          </span>
          <span className="text-dark-grey dark:text-off-white transition-colors">
            Checkout
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-dark-grey dark:text-off-white transition-colors">
            Checkout
          </h1>
          <Link
            to="/cart"
            className="flex items-center gap-2 text-soft-teal hover:underline transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* Shipping Form */}
          <div className="lg:col-span-3">
            <div className="bg-off-white dark:bg-muted-slate rounded-lg p-5 sm:p-6 transition-colors">
              <h2 className="text-xl font-bold text-dark-grey dark:text-off-white mb-4 flex items-center gap-2 transition-colors">
                <MapPin className="text-soft-teal" size={20} />
                Shipping Information
              </h2>

              {paymentError && (
                <div className="bg-soft-teal/10 dark:bg-soft-teal/20 border border-soft-teal/30 text-dark-grey dark:text-off-white px-4 py-3 rounded-lg mb-4 text-sm transition-colors">
                  {paymentError}
                </div>
              )}

              <form className="space-y-2.5 sm:p-10">
                <div className="grid sm:grid-cols-2 gap-4 sm:mb-2.5">
                  <input
                    type="text"
                    name="full_name"
                    value={shippingAddress.full_name}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    required
                    className="w-full px-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                  />
                  <div className="relative">
                    <MailIcon
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-slate dark:text-off-white/50 pointer-events-none transition-colors"
                      size={14}
                    />
                    <input
                      type="email"
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      required
                      className="w-full pl-9 pr-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-slate dark:text-off-white/50 pointer-events-none transition-colors"
                    size={14}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    placeholder="Phone Number *"
                    required
                    className="w-full pl-9 pr-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                  />
                </div>

                <input
                  type="text"
                  name="address_line1"
                  value={shippingAddress.address_line1}
                  onChange={handleChange}
                  placeholder="Street Address *"
                  required
                  className="w-full px-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                />

                <input
                  type="text"
                  name="address_line2"
                  value={shippingAddress.address_line2}
                  onChange={handleChange}
                  placeholder="Apartment, suite (optional)"
                  className="w-full px-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                />

                <div className="grid sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="City *"
                    required
                    className="w-full px-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                  />
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleChange}
                    placeholder="State *"
                    required
                    className="w-full px-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    name="postal_code"
                    value={shippingAddress.postal_code}
                    onChange={handleChange}
                    placeholder="Postal Code *"
                    required
                    className="w-full px-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                  />
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    placeholder="Country *"
                    required
                    className="w-full px-3 py-2 border border-warm-grey/50 dark:border-muted-slate rounded-md focus:outline-none focus:ring-1 focus:ring-soft-teal focus:border-transparent text-sm bg-white dark:bg-[#1a1d1e] text-dark-grey dark:text-off-white transition-colors"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-off-white dark:bg-muted-slate rounded-lg p-5 sm:p-6 sticky top-24 transition-colors">
              <h2 className="text-xl font-bold text-dark-grey dark:text-off-white mb-4 transition-colors">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-2.5 mb-4 max-h-56 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-warm-grey/10 dark:bg-[#1a1d1e]/50 rounded overflow-hidden flex-shrink-0 transition-colors">
                      <img
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark-grey dark:text-off-white truncate transition-colors">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-slate dark:text-off-white/70 transition-colors">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-dark-grey dark:text-off-white transition-colors">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Details */}
              <div className="space-y-2 mb-4 border-t border-muted-slate dark:border-muted-slate/50 pt-3 transition-colors">
                <div className="flex justify-between text-muted-slate dark:text-off-white/70 text-sm transition-colors">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-slate dark:text-off-white/70 text-sm transition-colors">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-slate dark:text-off-white/70 text-sm transition-colors">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-muted-slate dark:border-muted-slate/50 pt-2 transition-colors">
                  <div className="flex justify-between text-dark-grey dark:text-off-white text-lg font-bold transition-colors">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              {!isFormValid() && (
                <p className="text-xs text-muted-slate dark:text-off-white/70 mb-3 text-center transition-colors">
                  Please fill in all required fields
                </p>
              )}

              <RazorpayCheckout
                amount={total}
                shippingAddress={isFormValid() ? shippingAddress : null}
                onSuccess={() => setPaymentSuccess(true)}
                onError={(error) => setPaymentError(error)}
              />

              <p className="text-xs text-muted-slate dark:text-off-white/70 text-center mt-4 transition-colors">
                Secure payment powered by Razorpay
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
