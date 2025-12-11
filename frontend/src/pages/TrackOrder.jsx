import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import api from "../services/api";
import { getDeliveryInfo } from "../utils/orderUtils";

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-dark-grey">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto mb-4 text-warm-grey/40" size={64} />
          <h3 className="text-xl font-medium text-dark-grey mb-2">
            Order not found
          </h3>
          <Link to="/orders" className="text-soft-teal hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const deliveryInfo = getDeliveryInfo(order);
  const displayStatus = deliveryInfo.isDelivered ? "delivered" : order.status;

  const getTrackingSteps = () => {
    const orderDate = new Date(order.created_at);
    const steps = [
      {
        title: "Order Placed",
        description: "Your order has been placed successfully",
        date: orderDate,
        completed: true,
        icon: Package,
      },
      {
        title: "Order Confirmed",
        description: "Your order has been confirmed",
        date: new Date(orderDate.getTime() + 60 * 60 * 1000), // 1 hour after order
        completed: true,
        icon: CheckCircle,
      },
      {
        title: "Shipped",
        description: "Your order is on the way",
        date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000), // 1 day after order
        completed: deliveryInfo.isDelivered,
        icon: Truck,
      },
      {
        title: "Delivered",
        description: deliveryInfo.isDelivered
          ? "Your order has been delivered"
          : "Delivery in progress",
        date: deliveryInfo.isDelivered
          ? new Date(deliveryInfo.delivery_date)
          : null,
        completed: deliveryInfo.isDelivered,
        icon: MapPin,
      },
    ];

    return steps;
  };

  const trackingSteps = getTrackingSteps();
  const shippingAddress =
    typeof order.shipping_address === "string"
      ? JSON.parse(order.shipping_address)
      : order.shipping_address;

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/orders"
            className="text-soft-teal hover:underline mb-4 inline-block"
          >
            ← Back to Orders
          </Link>
          <h1
            className="text-3xl md:text-4xl font-normal text-dark-grey mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Track Order
          </h1>
          <p className="text-dark-grey/60">
            Order #{order.order_number || order.id}
          </p>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-medium text-dark-grey">
                Order Status
              </h2>
              <p className="text-sm text-dark-grey/60">
                Placed on{" "}
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                displayStatus === "delivered"
                  ? "bg-soft-teal/20 text-soft-teal"
                  : displayStatus === "confirmed"
                  ? "bg-muted-slate/20 text-muted-slate"
                  : "bg-warm-grey/30 text-dark-grey"
              }`}
            >
              {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
            </span>
          </div>

          {/* Delivery Contact Info */}
          {deliveryInfo.isDelivered && deliveryInfo.delivery_phone && (
            <div className="mb-6 p-4 bg-soft-teal/10 border border-soft-teal/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="text-soft-teal" size={20} />
                <span className="font-medium text-dark-grey">
                  Delivery Partner Contact
                </span>
              </div>
              <p className="text-dark-grey ml-7">
                {deliveryInfo.delivery_phone}
              </p>
              <p className="text-sm text-muted-slate ml-7 mt-1">
                Available today only
              </p>
            </div>
          )}

          {/* Tracking Timeline */}
          <div className="relative">
            {trackingSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex gap-4 mb-8 last:mb-0">
                  {/* Icon and Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? "bg-soft-teal text-off-white"
                          : "bg-warm-grey/20 text-warm-grey"
                      }`}
                    >
                      <Icon size={20} />
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-16 ${
                          step.completed ? "bg-soft-teal" : "bg-warm-grey/20"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3
                      className={`font-medium ${
                        step.completed ? "text-dark-grey" : "text-warm-grey"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        step.completed ? "text-muted-slate" : "text-warm-grey"
                      }`}
                    >
                      {step.description}
                    </p>
                    {step.date && (
                      <div className="flex items-center gap-1 text-xs text-dark-grey/50 mt-1">
                        <Calendar size={12} />
                        <span>
                          {step.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-dark-grey mb-4">
            Shipping Address
          </h2>
          <div className="text-dark-grey/70">
            <p className="font-medium">{shippingAddress.full_name}</p>
            <p>{shippingAddress.address}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.zip}
            </p>
            <p className="mt-2">Phone: {shippingAddress.phone}</p>
            <p>Email: {shippingAddress.email}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-dark-grey mb-4">
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div
                key={index}
                className="flex gap-4 pb-4 border-b last:border-b-0"
              >
                <img
                  src={item.product_image || "/placeholder-product.jpg"}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-dark-grey">
                    {item.product_name}
                  </h3>
                  <p className="text-sm text-dark-grey/60">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-soft-teal font-medium mt-1">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-medium text-dark-grey">Total Amount</span>
            <span className="text-xl font-semibold text-dark-grey">
              ₹{parseFloat(order.total_amount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
