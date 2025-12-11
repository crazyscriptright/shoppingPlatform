import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import Button from "./Button";

const RazorpayCheckout = ({ amount, shippingAddress, onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const RAZORPAY_KEY =
    import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_DUMMY_KEY";

  const handlePayment = async (retryCount = 0) => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
      return;
    }

    setLoading(true);

    try {
      // Create Razorpay order on backend
      const orderResponse = await api.post("/orders/create-razorpay-order", {
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
        cart_items: cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: shippingAddress,
      });

      const { razorpay_order_id, amount: orderAmount } = orderResponse.data;

      // Razorpay payment options
      const options = {
        key: RAZORPAY_KEY,
        amount: orderAmount,
        currency: "INR",
        name: "Flipcard",
        description: "Purchase from Flipcard Fashion Store",
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post("/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              await clearCart();
              if (onSuccess) {
                onSuccess(verifyResponse.data.order);
              }
              navigate("/orders", {
                state: { message: "Order placed successfully!" },
              });
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            if (onError) {
              onError("Payment verification failed");
            }
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingAddress?.phone || "",
        },
        theme: {
          color: "#546A7B",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        let errorMessage = "Payment failed";

        if (response.error.code === "SERVER_ERROR") {
          errorMessage =
            "Razorpay is experiencing technical difficulties. Please try again in a few minutes or contact support.";
        } else if (response.error.code === "BAD_REQUEST_ERROR") {
          if (
            response.error.reason === "international_transaction_not_allowed"
          ) {
            errorMessage =
              "International cards are not supported. Please use an Indian card or enable international payments in your Razorpay dashboard.";
          } else {
            errorMessage =
              response.error.description || "Payment request failed";
          }
        } else {
          errorMessage = response.error.description || "Payment failed";
        }

        if (onError) {
          onError(errorMessage);
        }
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);

      // Retry logic for server errors
      if (error.response?.status >= 500 && retryCount < 2) {
        console.log(`Retrying payment... Attempt ${retryCount + 1}`);
        setTimeout(() => {
          handlePayment(retryCount + 1);
        }, 2000);
        return;
      }

      let errorMsg = "Failed to initiate payment";
      if (error.response?.status >= 500) {
        errorMsg =
          "Payment service is temporarily unavailable. Please try again later.";
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      }

      if (onError) {
        onError(errorMsg);
      }
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || !shippingAddress}
      size="lg"
      fullWidth
      className="bg-soft-teal hover:bg-soft-teal/90"
    >
      {loading ? "Processing..." : `Pay ₹${amount.toFixed(2)}`}
    </Button>
  );
};

export default RazorpayCheckout;
