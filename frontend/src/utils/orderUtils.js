// Shared utility for calculating delivery info
export const getDeliveryInfo = (order) => {
  const now = new Date();

  // If delivery info exists in database, use it
  if (order.delivery_date && order.delivery_phone) {
    const deliveryDate = new Date(order.delivery_date);

    // Only mark as delivered if delivery date has passed
    if (deliveryDate > now) {
      return { isDelivered: false };
    }

    // Check if delivery was today (show contact only on delivery day)
    const deliveryDaysPassed = Math.floor(
      (now - deliveryDate) / (1000 * 60 * 60 * 24)
    );
    const showContact = deliveryDaysPassed === 0;

    return {
      isDelivered: true,
      delivery_date: order.delivery_date,
      delivery_phone: showContact ? order.delivery_phone : null,
    };
  }

  // Fallback: Calculate delivery info for orders without database values
  const orderDate = new Date(order.created_at);
  const daysSinceOrder = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

  // If order is less than 3 days old and status is confirmed, auto-deliver it
  if (daysSinceOrder < 3 && order.status === "confirmed") {
    // Use order ID as seed for consistent random values
    const seed = parseInt(order.id) * 12345;

    // Calculate delivery date: 1-2 days AFTER order date
    const deliveryDaysAfter = (seed % 2) + 1; // Either 1 or 2 days after order
    const deliveryDate = new Date(
      orderDate.getTime() + deliveryDaysAfter * 24 * 60 * 60 * 1000
    );

    // Only mark as delivered if delivery date has passed
    if (deliveryDate > now) {
      return { isDelivered: false }; // Not yet delivered
    }

    // Generate consistent phone number using order ID
    const phoneBase = 7000000000 + (seed % 3000000000);
    const deliveryPhone = `+91 ${phoneBase}`;

    // Check if delivery was today (show contact only on delivery day)
    const deliveryDaysPassed = Math.floor(
      (now - deliveryDate) / (1000 * 60 * 60 * 1000)
    );
    const showContact = deliveryDaysPassed === 0; // Show only on delivery day

    return {
      isDelivered: true,
      delivery_date: deliveryDate.toISOString(),
      delivery_phone: showContact ? deliveryPhone : null,
    };
  }

  return { isDelivered: false };
};
