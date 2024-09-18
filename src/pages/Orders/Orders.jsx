import React, { useContext, useEffect, useState } from "react";
import TopPageDetail from "../../components/TopPageDetail";
import supabase from "../../supabase";
import { SessionContext } from "../../components/SessionContext";
import { format } from "date-fns";
import DeliveredSvg from "../../images/order_delivered.svg";
import ShippedSvg from "../../images/shipped.svg";
import WaitingSvg from "../../images/order_recieved.svg";
import Clock from "../../components/clock";
import NoOrder from "../../images/noOrder.svg";
import OrderErrorSvg from "../../images/order_error.svg";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { session } = useContext(SessionContext);
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };
    fetchOrders();
    console.log(orders);
  }, [session]);
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="My Orders" />
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Clock />
        </div>
      ) : orders.length === 0 ? (
        <>
          <h2 className="text-2xl font-semibold text-gray-600 text-center mt-10">
            You haven't placed any orders yet !
          </h2>
          <div className="flex justify-center items-center h-full">
            <img src={NoOrder} alt="No Orders" className="w-1/2" />
          </div>
        </>
      ) : (
        <div className="p-4">
          {orders.map((order, index) => (
            // Order Card
            <div
              key={index}
              className="bg-white rounded-lg p-6 mb-4 flex cursor-pointer"
              style={{
                boxShadow:
                  "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
              }}
              onClick={() => navigate(`/order/${order.order_id}`)}
            >
              <div className="flex-grow">
                <h2 className="text-base font-bold mb-2 selectable">
                  Order ID: {order.order_id}
                </h2>
                {order.payment_method != "COD" && (
                  <p className="text-sm">
                    Order Status:{" "}
                    <span
                      className="font-bold"
                      style={{
                        color:
                          order.order_status === "waiting" &&
                          order.status === "paid"
                            ? "#f77f00"
                            : order.order_status === "shipped"
                            ? "blue"
                            : order.order_status === "delivered"
                            ? "green"
                            : "red",
                      }}
                    >
                      {order.order_status === "waiting" &&
                      order.status === "paid"
                        ? "Order Recieved"
                        : order.order_status === "shipped"
                        ? "Order Shipped"
                        : order.order_status === "delivered"
                        ? "Order Delivered"
                        : order.status !== "paid"
                        ? "Payment Failed"
                        : "Something went wrong. Please contact support."}
                    </span>
                  </p>
                )}
                {order.payment_method === "COD" && (
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
                        : "Something went wrong. Please contact support."}
                    </span>
                  </p>
                )}
                <p className="text-sm">
                  {order.payment_method == "COD"
                    ? "Amount to be Paid: "
                    : "Amount Paid:"}{" "}
                  ₹ <b>{order.amount}</b>
                </p>

                <h3 className="text-base font-bold mt-4 mb-2">Items:</h3>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-2 mb-2">
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16"
                    />
                    <div>
                      <p className="text-sm ">
                        Name: <span className="font-bold">{item.name}</span>
                      </p>
                      <p className="text-sm ">
                        Quantity:{" "}
                        <span className="font-bold">{item.quantity}</span>
                      </p>
                      {item.size !== 0 && (
                        <p className="text-sm ">
                          Size: <span className="font-bold">{item.size}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="ml-4 flex justify-center items-center">
                {order.payment_method === "Razorpay" &&
                order.razorpay_payment_id &&
                order.razorpay_order_id ? (
                  <>
                    {order.order_status === "waiting" && (
                      <img src={WaitingSvg} alt="Waiting" className="w-[8em]" />
                    )}
                    {order.order_status === "shipped" && (
                      <img src={ShippedSvg} alt="Shipped" className="w-[8em]" />
                    )}
                    {order.order_status === "delivered" && (
                      <img
                        src={DeliveredSvg}
                        alt="Delivered"
                        className="w-[8em]"
                      />
                    )}
                  </>
                ) : order.payment_method === "COD" ? (
                  <>
                    {order.order_status === "waiting" && (
                      <img src={WaitingSvg} alt="Waiting" className="w-[8em]" />
                    )}
                    {order.order_status === "shipped" && (
                      <img src={ShippedSvg} alt="Shipped" className="w-[8em]" />
                    )}
                    {order.order_status === "delivered" && (
                      <img
                        src={DeliveredSvg}
                        alt="Delivered"
                        className="w-[8em]"
                      />
                    )}
                  </>
                ) : (
                  <img
                    src={OrderErrorSvg}
                    alt="Order Error"
                    className="w-[8em]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
