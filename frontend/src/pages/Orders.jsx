import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, Calendar, DollarSign } from "lucide-react";
import api from "../services/api";
import { getDeliveryInfo } from "../utils/orderUtils";

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
        return "bg-warm-grey/30 text-dark-grey border-warm-grey/40";
      case "processing":
        return "bg-muted-slate/20 text-muted-slate border-muted-slate/30";
      case "shipped":
        return "bg-soft-teal/30 text-soft-teal border-soft-teal/40";
      case "delivered":
        return "bg-soft-teal/20 text-soft-teal border-soft-teal/30";
      case "cancelled":
        return "bg-muted-slate/30 text-dark-grey border-muted-slate/40";
      default:
        return "bg-warm-grey/20 text-dark-grey border-warm-grey/30";
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
        <div className="bg-warm-grey/10 rounded-lg p-5 mb-6">
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
                    : "bg-warm-grey/10 text-dark-grey hover:bg-warm-grey/20"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-off-white rounded-lg p-12 text-center">
            <Package className="mx-auto mb-4 text-warm-grey/40" size={64} />
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
            {filteredOrders.map((order) => {
              const deliveryInfo = getDeliveryInfo(order);
              const displayStatus = deliveryInfo.isDelivered
                ? "delivered"
                : order.status;

              return (
                <div
                  key={order.id}
                  className="bg-off-white rounded-lg transition overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-warm-grey/20">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-medium text-dark-grey">
                            Order #{order.order_number || order.id}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              displayStatus
                            )}`}
                          >
                            {displayStatus}
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
                          className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-warm-grey/10"
                        >
                          <img
                            src={
                              item.product_image || "/placeholder-product.jpg"
                            }
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="shrink-0 w-20 h-20 rounded-lg bg-warm-grey/10 flex items-center justify-center text-dark-grey/60 text-sm font-medium">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-warm-grey/5">
                    {deliveryInfo.isDelivered && (
                      <div className="mb-3 p-3 bg-soft-teal/10 border border-soft-teal/30 rounded-lg">
                        <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                          <div>
                            <span className="font-medium text-dark-grey">
                              Delivered on:{" "}
                            </span>
                            <span className="text-muted-slate">
                              {new Date(
                                deliveryInfo.delivery_date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          {deliveryInfo.delivery_phone && (
                            <div>
                              <span className="font-medium text-dark-grey">
                                Delivery Contact:{" "}
                              </span>
                              <span className="text-muted-slate">
                                {deliveryInfo.delivery_phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {displayStatus?.toLowerCase() === "delivered" && (
                        <button className="px-4 py-2 text-sm text-dark-grey border border-warm-grey/50 rounded hover:bg-warm-grey/10 transition">
                          Leave Review
                        </button>
                      )}
                      {displayStatus?.toLowerCase() === "pending" && (
                        <button className="px-4 py-2 text-sm text-muted-slate border border-muted-slate/40 rounded hover:bg-muted-slate/10 transition">
                          Cancel Order
                        </button>
                      )}
                      <Link
                        to={`/track-order/${order.id}`}
                        className="px-4 py-2 text-sm text-dark-grey border border-warm-grey/50 rounded hover:bg-warm-grey/10 transition"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
