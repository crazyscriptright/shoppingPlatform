import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.get("/cart");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user) {
      return false;
    }

    try {
      const response = await api.post("/cart", {
        product_id: product.id,
        quantity,
      });

      // Refresh cart from backend
      await fetchCart();
      return true;
    } catch (error) {
      console.error("Error adding to cart:", error);
      return false;
    }
  };

  const removeFromCart = async (productId) => {
    if (!user) return false;

    try {
      await api.delete(`/cart/${productId}`);
      await fetchCart();
      return true;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!user) return false;

    if (quantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      await api.put(`/cart/${productId}`, { quantity });
      await fetchCart();
      return true;
    } catch (error) {
      console.error("Error updating cart:", error);
      return false;
    }
  };

  const clearCart = async () => {
    if (!user) return false;

    try {
      await api.delete("/cart");
      setCart([]);
      return true;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  };

  const getCartTotal = () => {
    return cart.reduce(
      (total, item) => total + parseFloat(item.price) * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        loading,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
