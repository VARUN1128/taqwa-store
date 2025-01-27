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
import moment from "moment";
import { LiaFileDownloadSolid } from "react-icons/lia";

import { FaTruck } from "react-icons/fa";

const getShippingStep = (order) => {
  if (order.order_status === "cancelled") return -1; // Cancelled state
  if (!order.waybill && order.order_status === "waiting") return 1;
  if (order.waybill && order.order_status === "waiting") return 2;
  if (order.order_status === "shipped") return 3;
  if (order.order_status === "delivered") return 4;
  return 1;
};

const ShippingProgress = ({ order, isLoading }) => {
  const [showProgress, setShowProgress] = useState(false);
  const currentStep = getShippingStep(order);
  const progress = ((currentStep - 1) / 3) * 100;
  const isCancelled = order.order_status === "cancelled";

  useEffect(() => {
    if (!isLoading) {
      // Start animation after loading completes
      const timer = setTimeout(() => {
        setShowProgress(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div
      className={`w-full max-w-3xl mx-auto px-4 py-6 transition-all duration-300 ${
        isLoading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: showProgress
                ? isCancelled
                  ? "100%"
                  : `${progress}%`
                : "0%",
              backgroundColor: isCancelled ? "#EF4444" : "#3B82F6",
            }}
          >
            <div
              className="absolute -top-2 transform -translate-y-1/2 transition-all duration-1000 ease-out"
              style={{
                left: showProgress
                  ? isCancelled
                    ? "100%"
                    : `${progress}%`
                  : "0%",
              }}
            >
              <FaTruck
                className={`text-2xl ${
                  isCancelled ? "text-red-600" : "text-blue-600"
                }`}
              />
            </div>
          </div>
        </div>
        {/* Status Labels */}
        <div className="flex justify-between mt-4">
          <div
            className={`text-sm ${
              isCancelled
                ? "text-red-600 font-medium"
                : currentStep >= 1
                ? "text-blue-600 font-medium"
                : "text-gray-400"
            }`}
          >
            {isCancelled ? "Order Cancelled" : "Waiting"}
          </div>
          <div
            className={`text-sm ${
              isCancelled
                ? "text-red-600 font-medium"
                : currentStep >= 2
                ? "text-blue-600 font-medium"
                : "text-gray-400"
            }`}
          >
            Ready to Pickup
          </div>
          <div
            className={`text-sm ${
              isCancelled
                ? "text-red-600 font-medium"
                : currentStep >= 3
                ? "text-blue-600 font-medium"
                : "text-gray-400"
            }`}
          >
            Shipped
            {currentStep === 3 && order.delhivery_status?.StatusLocation && (
              <div className="text-xs text-gray-500">
                <span className="block">
                  Currently: {order.delhivery_status.StatusLocation}
                </span>
                <span className="block">
                  Expected Delivery:{" "}
                  {order.delhivery_status.ExpectedDeliveryDate}
                </span>
              </div>
            )}
          </div>
          <div
            className={`text-sm ${
              isCancelled
                ? "text-red-600 font-medium"
                : currentStep >= 4
                ? "text-blue-600 font-medium"
                : "text-gray-400"
            }`}
          >
            Delivered
          </div>
        </div>
        {/* Tracking ID */}
        {order.waybill && (
          <div className="mt-4 p-2  rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-black">
                Waybill/Tracking/AWB ID:
              </span>
              <span className="text-sm font-medium select-all">
                {order.waybill}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
const OrderDetail = () => {
  const { session } = useContext(SessionContext);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviewProduct, setReviewProduct] = useState("");
  const [cod_charge, setCodCharge] = useState(0);
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
    if (order && order.payment_method === "COD") {
      const ordercod_charge = Object.values(order.items).reduce(
        (total, item) => {
          const codPrice =
            item.codPriceMap && item.size
              ? item.codPriceMap[item.size]
              : item.cod_price;
          return total + (codPrice ? codPrice : 0);
        },
        0
      );
      setCodCharge(ordercod_charge);
      console.log("COD Charge:", ordercod_charge);
    }
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

  const printDetails = () => {
    let printWindow = window.open("", "_blank");
    printWindow.document.write(`
<html>
<head>
  <title>${order.order_id}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
      font-size: 0.8em; /* Reduce font size */
    }
    .invoice-header {
      text-align: center;
      padding: 15px; /* Reduce padding */
      background-color: #f8f8f8;
      border-bottom: 1px solid #ddd;
    }
    .invoice-body {
      padding: 15px; /* Reduce padding */
      border: 1px solid #ddd;
      margin: 15px; /* Reduce margin */
    }
    .invoice-footer {
      text-align: center;
      padding: 15px; /* Reduce padding */
      background-color: #f8f8f8;
      border-top: 1px solid #ddd;
    }
    .section-header {
      font-weight: bold;
      margin-top: 10px; /* Reduce margin */
      margin-bottom: 5px; /* Reduce margin */
      text-transform: uppercase;
      color: #666;
    }
    .item-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px; /* Reduce margin */
      border-bottom: 1px solid #eee;
      padding-bottom: 5px; /* Reduce padding */
    }
    p {
      margin: 0;
    }
  </style>
</head>
<body>
`);
    printWindow.document.write(
      "<div class='invoice-header'><h2>Invoice</h2></div>"
    );
    printWindow.document.write("<div class='invoice-body'>");
    printWindow.document.write("<h3 class='section-header'>Order Details</h3>");
    printWindow.document.write(`<p>Order ID: <b>${order.order_id}</b></p>`);
    printWindow.document.write(`<p>E Biller ID: <b>55938</b></p>`);
    printWindow.document.write(
      `<p>Payment Method: ${order.payment_method}</p>`
    );

    printWindow.document.write(
      `<p>Total Amount: <b> ₹${order.amount}</b> </p>`
    );

    if (cod_charge) {
      printWindow.document.write(`<p>COD Charge:<b>₹ ${cod_charge}<b></p>`);
    }
    if (order.razorpay_payment_id) {
      printWindow.document.write(
        `<p>Payment Id: ${order.razorpay_payment_id}</p>`
      );
    }
    printWindow.document.write(
      `<p>Created At: ${moment(order.created_at).format(
        "MMMM Do YYYY, h:mm:ss a"
      )}</p>`
    );

    printWindow.document.write(
      "<h3 class='section-header'>User Information</h3>"
    );
    printWindow.document.write(
      `<p>Name: ${session.user.user_metadata.full_name}</p>`
    );
    printWindow.document.write(`<p>Email: ${session.user.email}</p>`);
    printWindow.document.write("<h3 class='section-header'>Address</h3>");
    printWindow.document.write(`<p>${order.address.name}</p>`);
    printWindow.document.write(`<p>${order.address.phone}</p>`);
    printWindow.document.write(`<p>${order.address.address}</p>`);
    printWindow.document.write(`<p>${order.address.city}</p>`);
    printWindow.document.write(`<p>${order.address.state}</p>`);
    printWindow.document.write(`<p>${order.address.zip}</p>`);
    printWindow.document.write(`<p>${order.address.whatsapp}</p>`);
    printWindow.document.write(`<p>${order.address.country}</p>`);
    printWindow.document.write("<h3 class='section-header'>Items</h3>");
    printWindow.document.write(
      "<table style='width: 100%; border-collapse: collapse;'>"
    );
    printWindow.document.write("<tr style='border-bottom: 1px solid #ddd;'>");
    printWindow.document.write(
      "<th style='text-align: left; padding: 10px;'>Name</th>"
    );
    printWindow.document.write(
      "<th style='text-align: left; padding: 10px;'>Price</th>"
    );
    printWindow.document.write(
      "<th style='text-align: left; padding: 10px;'>Quantity</th>"
    );
    printWindow.document.write(
      "<th style='text-align: left; padding: 10px;'>Category</th>"
    );
    printWindow.document.write(
      "<th style='text-align: left; padding: 10px;'>Size</th>"
    );
    printWindow.document.write("</tr>");

    order.items.forEach((item) => {
      printWindow.document.write("<tr style='border-bottom: 1px solid #eee;'>");
      printWindow.document.write(
        `<td style='padding: 10px;'>${item.name}</td>`
      );
      printWindow.document.write(
        `<td style='padding: 10px;'>₹${
          item.priceMap ? item.priceMap[item.size] : item.price
        }</td>`
      );
      printWindow.document.write(
        `<td style='padding: 10px;'>${item.quantity}</td>`
      );
      printWindow.document.write(
        `<td style='padding: 10px;'>${item.category}</td>`
      );
      if (item.size) {
        printWindow.document.write(
          `<td style='padding: 10px;'>${item.size}</td>`
        );
      } else {
        printWindow.document.write(`<td style='padding: 10px;'>N/A</td>`);
      }
      printWindow.document.write("</tr>");
    });

    printWindow.document.write("</table>");
    printWindow.document.write("<div class='invoice-footer'>");
    printWindow.document.write("<h3 class='section-header'>Contact Us</h3>");

    printWindow.document.write("<p>Phone: +91 81292 40844</p>");
    // add an instagram logo linked to instagram
    printWindow.document.write(
      "<a href='https://www.instagram.com/taqwa_fashionstore_ekm/'><img src='https://cdn-icons-png.flaticon.com/512/2111/2111463.png' alt='Instagram' style='width: 30px; height: 30px;'></a>"
    );

    printWindow.document.write("</div>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const cancelOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ORDER_URL}/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            order_id: order.order_id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel the order");
      }

      if (data.success) {
        toast.success("Order cancelled successfully");
      } else {
        throw new Error(data.message || "Failed to cancel the order");
      }
    } catch (error) {
      toast.error(`${error.message}`);
    }
  };

  const confirmCancelOrder = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to cancel the order?</p>
          <button
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition duration-300 mr-2"
            onClick={() => {
              cancelOrder();
              closeToast();
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-700 transition duration-300"
            onClick={closeToast}
          >
            No
          </button>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="Order Details" />
      <ToastContainer />
      <div
        className="bg-white rounded-lg p-2 mt-4 flex flex-row justify-between max-w-[90%] mx-auto lg:w-[40%] "
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
                      : order.order_status === "cancelled"
                      ? "grey"
                      : "red",
                }}
              >
                {order.order_status === "waiting" && order.status === "paid"
                  ? "Order Received"
                  : order.order_status === "shipped"
                  ? "Order Shipped"
                  : order.order_status === "delivered"
                  ? "Order Delivered"
                  : order.order_status === "cancelled"
                  ? "Order Cancelled"
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
                      : order.order_status === "cancelled"
                      ? "grey"
                      : "red",
                }}
              >
                {order.order_status === "waiting"
                  ? "Order Received"
                  : order.order_status === "shipped"
                  ? "Order Shipped"
                  : order.order_status === "delivered"
                  ? "Order Delivered"
                  : order.order_status === "cancelled"
                  ? "Order Cancelled"
                  : "Something went wrong. Please contact support."}
              </span>
            </p>
          )}
          <p className="text-md">
            {order.payment_method === "COD"
              ? "Amount to be Paid: "
              : "Amount Paid: "}
            ₹ <b> {order.amount}</b>
          </p>
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
              {item.size !== 0 && (
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
              <p className="text-md">Whatsapp: {order.address.whatsapp}</p>
              <p className="text-md">Country: {order.address.country}</p>
            </>
          )}
        </div>
        <div className="ml-4 flex justify-center items-center relative">
          <LiaFileDownloadSolid
            className="cursor-pointer
          absolute bottom-0 right-0 p-2  rounded-full
          bg-white shadow-md"
            size={45}
            color="black"
            onClick={printDetails}
          />
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
              {order.order_status === "cancelled" && (
                <img src={OrderErrorSvg} alt="Cancelled" className="w-[8em]" />
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
              {order.order_status === "cancelled" && (
                <img src={OrderErrorSvg} alt="Cancelled" className="w-[8em]" />
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

      <div className="flex justify-center mt-4">
        {order.order_status !== "delivered" &&
          order.order_status !== "cancelled" &&
          order.payment_method === "COD" && (
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
              onClick={confirmCancelOrder}
            >
              Cancel
            </button>
          )}
      </div>
      {order && <ShippingProgress order={order} isLoading={isLoading} />}

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
