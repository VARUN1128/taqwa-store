import React, { useContext, useEffect, useState } from "react";
import TopPageDetail from "../../components/TopPageDetail";
import supabase from "../../supabase";
import { SessionContext } from "../../components/SessionContext";
import { format } from "date-fns";
import DeliveredSvg from "../../images/order_delivered.svg";
import ShippedSvg from "../../images/shipped.svg";
import WaitingSvg from "../../images/order_recieved.svg";

const Orders = () => {
  const { session } = useContext(SessionContext);
  const [orders, setOrders] = useState([]);
  const [showFullAddress, setShowFullAddress] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false }); // sort by 'created_at' in descending order
      if (error) {
        console.error("Error fetching orders", error);
      } else {
        setOrders(data);
      }
    };
    fetchOrders();
  }, [session]);
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="My Orders" />
      <div className="p-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 mb-4 flex"
            style={{
              boxShadow:
                "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
            }}
          >
            <div className="flex-grow">
              <h2 className="text-base font-bold mb-2">
                Order ID: {order.order_id}
              </h2>
              <p className="text-sm">Payment ID: {order.payment_id}</p>
              <p className="text-sm">
                Payment Status:{" "}
                <span
                  style={{
                    color: order.status === "paid" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {order.status === "paid"
                    ? "Paid"
                    : "Something went wrong. Contact Support"}
                </span>
              </p>
              <p className="text-sm">
                Order Status:{" "}
                <span
                  className="font-bold"
                  style={{
                    color:
                      order.order_status === "waiting"
                        ? "#f77f00"
                        : order.order_status === "shipped"
                        ? "blue"
                        : order.order_status === "delivered"
                        ? "green"
                        : "red",
                  }}
                >
                  {order.order_status === "waiting"
                    ? "Order Recieved"
                    : order.order_status === "shipped"
                    ? "Order Shipped"
                    : order.order_status === "delivered"
                    ? "Order Delivered"
                    : "Something went wrong. Contact Support"}
                </span>
              </p>
              <p className="text-sm">Amount: {order.amount}</p>
              <p className="text-sm">
                Ordered At: {format(new Date(order.created_at), "do MMM yyyy")}
              </p>
              <h3 className="text-base font-bold mt-4 mb-2">Items:</h3>
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <p className="text-sm">Name: {item.name}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
              ))}
              {order.address && (
                <>
                  <h3 className="text-base font-bold mt-4 mb-2">
                    Delivery Address:
                  </h3>
                  <p className="text-sm">Name: {order.address.name}</p>
                  <p className="text-sm">Phone: {order.address.phone}</p>
                  {showFullAddress ? (
                    <>
                      <p className="text-sm">
                        Address: {order.address.address}
                      </p>
                      <p className="text-sm">City: {order.address.city}</p>
                      <p className="text-sm">State: {order.address.state}</p>
                      <p className="text-sm">Zip: {order.address.zip}</p>
                      <p className="text-sm">
                        Country: {order.address.country}
                      </p>
                      <button
                        onClick={() => setShowFullAddress(false)}
                        className="text-blue-500"
                      >
                        View Less
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowFullAddress(true)}
                      className="text-blue-500"
                    >
                      View More
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="ml-4 flex justify-center items-center">
              {order.order_status === "waiting" && (
                <img src={WaitingSvg} alt="Waiting" className="w-[10em]" />
              )}
              {order.order_status === "shipped" && (
                <img src={ShippedSvg} alt="Shipped" className="w-[10em]" />
              )}
              {order.order_status === "delivered" && (
                <img src={DeliveredSvg} alt="Delivered" className="w-[10em]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
