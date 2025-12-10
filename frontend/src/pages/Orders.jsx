import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Calendar, DollarSign } from "lucide-react";
import api from "../services/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, shipped, delivered, cancelled

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-dark-grey">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-normal text-dark-grey mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            My Orders
          </h1>
          <p className="text-dark-grey/60">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "pending",
              "processing",
              "shipped",
              "delivered",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === status
                    ? "bg-soft-teal text-off-white"
                    : "bg-gray-100 text-dark-grey hover:bg-gray-200"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="mx-auto mb-4 text-gray-300" size={64} />
            <h3 className="text-xl font-medium text-dark-grey mb-2">
              No orders found
            </h3>
            <p className="text-dark-grey/60 mb-6">
              {filter === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${filter} orders.`}
            </p>
            <Link
              to="/shop"
              className="inline-block px-6 py-3 bg-soft-teal text-off-white rounded hover:bg-soft-teal/90 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-dark-grey">
                          Order #{order.order_number || order.id}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-dark-grey/60">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package size={14} />
                          <span>
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-dark-grey font-medium mb-1">
                        <DollarSign size={16} />
                        <span className="text-xl">
                          {parseFloat(order.total_amount || 0).toFixed(2)}
                        </span>
                      </div>
                      <Link
                        to={`/order/${order.id}`}
                        className="inline-flex items-center gap-1 text-sm text-soft-teal hover:text-dark-grey transition"
                      >
                        View Details
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex gap-4 overflow-x-auto">
                    {order.items?.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={item.product_image || "/placeholder-product.jpg"}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-dark-grey/60 text-sm font-medium">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 flex flex-wrap gap-2">
                  {order.status?.toLowerCase() === "delivered" && (
                    <button className="px-4 py-2 text-sm text-dark-grey border border-gray-300 rounded hover:bg-gray-100 transition">
                      Leave Review
                    </button>
                  )}
                  {order.status?.toLowerCase() === "pending" && (
                    <button className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition">
                      Cancel Order
                    </button>
                  )}
                  <button className="px-4 py-2 text-sm text-dark-grey border border-gray-300 rounded hover:bg-gray-100 transition">
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
