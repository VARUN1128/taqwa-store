import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopPageDetail from "../../components/TopPageDetail";
import { SessionContext } from "../../components/SessionContext";
import Clock from "../../components/clock";
import supabase from "../../supabase";
import { format } from "date-fns";
import DeliveredSvg from "../../images/order_delivered.svg";
import ShippedSvg from "../../images/shipped.svg";
import WaitingSvg from "../../images/order_recieved.svg";
import OrderErrorSvg from "../../images/order_error.svg";
import { PiStar } from "react-icons/pi";
import { PiStarFill } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";

const OrderDetail = () => {
  const { session } = useContext(SessionContext);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewProduct, setReviewProduct] = useState("");

  const { orderId } = useParams();

  const navigate = useNavigate();
  useEffect(() => {
    if (order && order.items && order.items.length > 0) {
      setReviewProduct(order.items[0].id);
    }
  }, [order]);
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("order_id", orderId);
      if (error) {
        console.error("Error fetching orders", error);
      } else {
        setOrder(data[0]);
        setIsLoading(false);
        console.log("Order:", data);
      }
    };
    fetchOrder();
  }, [session.user.id]);

  const addReview = async () => {
    console.log("Review:", review);
    if (review.length < 5) {
      toast.error("Review should be at least 5 characters long");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const response = await fetch(
      "https://ecvdsyezeauzidjqmpyc.supabase.co/functions/v1/add-rating",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          product_id: reviewProduct,
          comment: review,
          rating: rating,
          order_id: order.order_id,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.error);
    } else {
      toast.success("Review added successfully");
    }
  };

  if (isLoading) {
    return (
      <div className="page">
        <TopPageDetail title="Order Details" />

        <div className="flex items-center justify-center h-[80vh]">
          <Clock />
        </div>
      </div>
    );
  }
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="Order Details" />
      <ToastContainer />
      <div
        className="bg-white rounded-lg p-2 mt-4 flex flex-row justify-between max-w-[90%] mx-auto"
        style={{
          boxShadow:
            "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
        }}
      >
        <div className="flex flex-col  p-3">
          <h2 className="text-base font-bold mb-2">
            Order ID: {order.order_id}
          </h2>
          {order.payment_method != "COD" && (
            <p className="text-md">Payment ID: {order.razorpay_payment_id}</p>
          )}

          <p className="text-md">
            Payment Method:{" "}
            <span className="font-bold">{order.payment_method}</span>
          </p>

          {order.payment_method != "COD" && (
            <p className="text-md">
              Order Status:{" "}
              <span
                className="font-bold"
                style={{
                  color:
                    order.order_status === "waiting" && order.status === "paid"
                      ? "#f77f00"
                      : order.order_status === "shipped"
                      ? "blue"
                      : order.order_status === "delivered"
                      ? "green"
                      : "red",
                }}
              >
                {order.order_status === "waiting" && order.status === "paid"
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
            <p className="text-md">
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
          <p className="text-md">Amount Paid: ₹ {order.amount}</p>
          <p className="text-md">
            Ordered At: {format(new Date(order.created_at), "do MMM yyyy")}
          </p>
          <h3 className="text-base font-bold mt-4 mb-2">Items:</h3>
          {order.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="cursor-pointer mb-2"
              onClick={() => navigate(`/product/${item.id}#top`)}
            >
              <p className="text-md ">
                Name: <span className="font-bold">{item.name}</span>
              </p>
              <p className="text-md ">
                Quantity: <span className="font-bold">{item.quantity}</span>
              </p>
              {item.size && (
                <p className="text-md ">
                  Size: <span className="font-bold">{item.size}</span>
                </p>
              )}
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-16 h-16 object-cover"
              />
            </div>
          ))}
          {order.address && (
            <>
              <h3 className="text-base font-bold mt-4 mb-2">
                Delivery Address:
              </h3>
              <p className="text-md">Name: {order.address.name}</p>
              <p className="text-md">Phone: {order.address.phone}</p>

              <p className="text-md">Address: {order.address.address}</p>
              <p className="text-md">City: {order.address.city}</p>
              <p className="text-md">State: {order.address.state}</p>
              <p className="text-md">Zip: {order.address.zip}</p>
              <p className="text-md">Country: {order.address.country}</p>
            </>
          )}
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
                <img src={DeliveredSvg} alt="Delivered" className="w-[8em]" />
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
                <img src={DeliveredSvg} alt="Delivered" className="w-[8em]" />
              )}
            </>
          ) : (
            <img src={OrderErrorSvg} alt="Order Error" className="w-[8em]" />
          )}
        </div>
      </div>
      {order.order_status === "delivered" && (
        <div>
          <h2 className="text-xl text-left ml-3 my-3 product-sans ">
            Rate your experience with the order
          </h2>
          <div className="flex flex-col items-center justify-center m-auto">
            <select
              className="w-[50%] p-2 my-2 border"
              value={reviewProduct}
              onChange={(e) => {
                setReviewProduct(Number(e.target.value));
              }}
            >
              {order.items.map((option, optionIndex) => (
                <option key={optionIndex} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
            <textarea
              className="border border-gray-300 rounded-md p-2 w-[80%] h-32 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-transparent"
              placeholder="Write your review here..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <div className="flex flex-row mt-2">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  onClick={() => setRating(index + 1)}
                  className="cursor-pointer"
                >
                  {rating >= index + 1 ? (
                    <PiStarFill color="#03a685" size={30} />
                  ) : (
                    <PiStar color="#03a685" size={30} />
                  )}
                </span>
              ))}
            </div>
            <button
              className=" text-white p-2 px-5 rounded-md my-2"
              style={{ backgroundColor: "#03a685" }}
              onClick={addReview}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
