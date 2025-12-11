import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, Calendar, DollarSign, Phone } from "lucide-react";
import api from "../../services/api";
import { getDeliveryInfo } from "../../utils/orderUtils";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/admin/orders");
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
      case "confirmed":
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-soft-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-slate dark:text-off-white/60 mb-2 transition-colors">
            <Link to="/admin" className="hover:text-soft-teal">
              Dashboard
            </Link>
            <span>/</span>
            <span>Orders</span>
          </div>
          <h1 className="text-4xl font-bold text-dark-grey dark:text-off-white mb-2 transition-colors">
            Manage Orders
          </h1>
          <p className="text-muted-slate dark:text-off-white/70 transition-colors">
            View and manage all customer orders
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-warm-grey/20 dark:bg-muted-slate/20 rounded-lg p-5 mb-6 transition-colors">
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "pending",
              "confirmed",
              "shipped",
              "delivered",
              "cancelled",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-soft-teal text-off-white"
                    : "bg-off-white dark:bg-dark-grey text-dark-grey dark:text-off-white hover:bg-warm-grey/10 dark:hover:bg-muted-slate/20"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-xs">
                  (
                  {status === "all"
                    ? orders.length
                    : orders.filter((o) => o.status?.toLowerCase() === status)
                        .length}
                  )
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-warm-grey/20 dark:bg-muted-slate/20 rounded-lg p-5 transition-colors">
            <div className="text-3xl font-bold text-dark-grey">
              {orders.length}
            </div>
            <div className="text-sm text-muted-slate mt-1">Total Orders</div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-5">
            <div className="text-3xl font-bold text-dark-grey">
              {orders.filter((o) => o.status === "confirmed").length}
            </div>
            <div className="text-sm text-muted-slate mt-1">Confirmed</div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-5">
            <div className="text-3xl font-bold text-dark-grey">
              {orders.filter((o) => o.status === "delivered").length}
            </div>
            <div className="text-sm text-muted-slate mt-1">Delivered</div>
          </div>
          <div className="bg-warm-grey/20 rounded-lg p-5">
            <div className="text-2xl font-bold text-dark-grey">
              ₹
              {orders
                .reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0)
                .toFixed(2)}
            </div>
            <div className="text-sm text-muted-slate dark:text-off-white/70 transition-colors">
              Total Revenue
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-off-white dark:bg-dark-grey rounded-lg overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warm-grey/20 dark:bg-muted-slate/20 transition-colors">
                <tr>
                  <th className="text-left py-4 px-6 text-dark-grey dark:text-off-white font-semibold transition-colors">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Customer
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Amount
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Payment
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Delivery
                  </th>
                  <th className="text-left py-4 px-6 text-dark-grey font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-muted-slate dark:text-off-white/60 transition-colors"
                    >
                      <Package size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const deliveryInfo = getDeliveryInfo(order);
                    const displayStatus = deliveryInfo.isDelivered
                      ? "delivered"
                      : order.status;

                    return (
                      <tr
                        key={order.id}
                        className="border-t border-warm-grey dark:border-muted-slate/30 hover:bg-off-white/50 dark:hover:bg-muted-slate/10 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-dark-grey dark:text-off-white transition-colors">
                            #{order.order_number || order.id}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-dark-grey dark:text-off-white transition-colors">
                            {order.user_name}
                          </div>
                          <div className="text-sm text-muted-slate dark:text-off-white/60 transition-colors">
                            {order.user_email}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-muted-slate dark:text-off-white/70 transition-colors">
                            <Calendar size={14} />
                            <span className="text-sm">
                              {new Date(order.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-dark-grey dark:text-off-white font-semibold transition-colors">
                            <DollarSign size={16} />
                            <span>
                              ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              order.payment_status === "paid"
                                ? "bg-soft-teal/20 text-soft-teal"
                                : "bg-warm-grey/30 text-dark-grey"
                            }`}
                          >
                            {order.payment_status || "pending"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              displayStatus
                            )}`}
                          >
                            {displayStatus}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {deliveryInfo.isDelivered ? (
                            <div className="text-sm">
                              <div className="text-soft-teal font-medium">
                                {new Date(
                                  deliveryInfo.delivery_date
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </div>
                              {deliveryInfo.delivery_phone && (
                                <div className="flex items-center gap-1 text-muted-slate text-xs">
                                  <Phone size={12} />
                                  <span>{deliveryInfo.delivery_phone}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-slate">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <Link
                            to={`/track-order/${order.id}`}
                            className="inline-flex items-center gap-1 text-soft-teal hover:text-dark-grey transition text-sm"
                          >
                            <Eye size={16} />
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
