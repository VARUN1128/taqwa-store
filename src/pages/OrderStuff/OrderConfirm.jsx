import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopPageDetail from "../../components/TopPageDetail";
import { MdDeleteForever } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import supabase from "../../supabase";
import { SessionContext } from "../../components/SessionContext";
import { useDispatch, useSelector } from "react-redux";
import { removeEntireItem } from "../../components/cartSlice";
import axios from "axios";
import { useCallback } from "react";
import useRazorpay from "react-razorpay";
import { SiRazorpay } from "react-icons/si";
import PaymentProcessLoadScreen from "../../components/PaymentProcessLoadScreen";

import { FaWhatsapp } from "react-icons/fa";

function Modal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto ">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 ">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mb-8 ">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Pay on Delivery requires Whatsapp based Confirmation. Proceed?
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onConfirm}
            >
              <FaWhatsapp className="mr-2" size={25} /> Yes
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_ORDER_URL;

export default function OrderConfirm() {
  const [addressLoaded, setAddressLoaded] = useState(false);

  const address = useRef(null);

  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [Razorpay] = useRazorpay();
  const [paymentloadscreenmessage, setPaymentLoadScreenMessage] = useState("");
  const [completed, setCompleted] = useState(false);

  const dispatch = useDispatch();
  const avatarInfo = session?.user.user_metadata;
  const cart = useSelector((state) => state.cart);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPaymentResponseOnSuccess = async (
    paymentId,
    razorpay_order_id,
    signature
  ) => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("razorpay_order_id", razorpay_order_id)
      .eq("status", "paid")
      .single();

    if (data) {
      console.log("Order already captured");
      setCompleted(true);
      dispatch(removeEntireItem());
    } else {
      const paymentResponse = await axios
        .post(
          `${BACKEND_URL}create-order/capture`,
          {
            paymentId,
            signature,
            razorpay_order_id,
            status: "paid",
            items: cart,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        )
        .catch((error) => {
          console.error("Error capturing payment");
          setPaymentLoadScreenMessage(
            `Payment Failed, 
          Use the order id to contact the support team: ${razorpay_order_id},
          Payment Id: ${paymentId}`
          );
        });

      if (paymentResponse && paymentResponse.status === 200) {
        console.log(paymentResponse);
        setCompleted(true);
        dispatch(removeEntireItem());
        // navigate("/orders");
      }
    }
  };

  let convenienceFees = (
    Object.values(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) * 0.02
  ).toFixed(2);

  convenienceFees = parseFloat(convenienceFees);

  const totalFinalPrice =
    Object.values(cart).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) + convenienceFees;

  const createOrder = async () => {
    console.log("Address", address.current);
    const response = await axios.post(
      `${BACKEND_URL}/create-order`,
      {
        description: "Payment for food",
        user_id: session.user.id,
        user_name: avatarInfo.full_name,
        items: cart,
        address: address.current,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      }
    );
    if (response.status !== 200) {
      console.error("Error creating order");
    }
    console.log(response);
    return response;
  };

  const handlePayment = useCallback(async () => {
    // console.log(address.current);
    // console.log(avatarInfo);
    // console.log(session);
    // console.log(cart);
    // console.log(test);
    if (!Razorpay) {
      return;
    }

    if (itemCount === 0) {
      alert("Please add items to cart");
      return;
    }
    if (!loading) {
      setLoading(true);
    } else {
      return;
    }
    let response = null;
    try {
      response = await createOrder();
    } catch (error) {
      console.error("Error creating order");
      setLoading(false);
      return;
    }

    if (response.status !== 200) {
      console.error("Error creating order");
      return;
    }

    const order = response.data;
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY,
      amount: order.amount,
      currency: order.currency,
      name: "Taqwa Fashion Store",
      description: "Payment for accessories",
      order_id: order.id,
      prefill: {
        name: avatarInfo.full_name,
        email: session.user.email,
        contact: avatarInfo.phone_number,
      },
      handler: async (response) => {
        console.log(response);
        const paymentId = response.razorpay_payment_id;
        const signature = response.razorpay_signature;
        const razorpay_order_id = response.razorpay_order_id;
        const orderId = response.razorpay_order_id;
        await getPaymentResponseOnSuccess(
          paymentId,
          razorpay_order_id,
          signature
        );
      },
      modal: {
        ondismiss: function () {
          setPaymentLoadScreenMessage("Payment Cancelled");
          setTimeout(() => {
            setPaymentLoadScreenMessage("");
            setLoading(false);
          }, 500);
        },
      },
      theme: {
        color: "#1CA672",
      },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (response) {
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);

      setPaymentLoadScreenMessage("Payment Failed");
      setTimeout(() => {
        setPaymentLoadScreenMessage("");
        setLoading(false);
      }, 500);
    });

    rzp.open();
  }, [Razorpay, cart]);
  useEffect(() => {
    console.log("Component mounted");
    if (session) {
      console.log("Session at mount:", session);
      const fetchAddress = async () => {
        const { data, error } = await supabase
          .from("users")
          .select("address")
          .eq("id", session.user.id)
          .single();
        if (error) {
          console.error("Error fetching address");
          return;
        }
        console.log("Fetched address:", data.address);
        address.current = JSON.parse(data.address);
        setAddressLoaded(true); // Trigger a re-render
      };
      fetchAddress();
    }
  }, []);
  useEffect(() => {
    console.log("Session changed");
    console.log("New session:", session);
  }, [session]);
  const whatsAppPayment = async () => {
    const message = `🛒 Order Confirmed 🛒\n\n📦 Shipping Address 📦\n\nName: ${
      address.current.name
    }\nPhone: ${address.current.phone}\nEmail: ${
      session.user.email
    }\nAddress: ${address.current.address.current}\nZip: ${
      address.current.zip
    }\nCity: ${address.current.city}\nState: ${
      address.current.state || ""
    }\nCountry: ${
      address.current.country || ""
    }\n\n📦 Order Details 📦\n\n${cart
      .map(
        (product) =>
          `Product: ${product.name}\nQuantity: ${product.quantity}\nPrice: ₹ ${
            product.price * product.quantity
          }\nCategory: ${
            product.category
          }\nLink: https://taqwafashionstore.com/product/${product.id}`
      )
      .join("\n\n")}\n\nTotal: ₹ ${cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )}`;

    const url = `https://api.whatsapp.com/send?phone=+919495917116&text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
    dispatch(removeEntireItem());
    navigate("/");
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    whatsAppPayment();
  };

  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[6em]">
      <TopPageDetail title="Confirm Order" />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleModalConfirm}
      />
      {address.current && (
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Order Summary</h1>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="mt-2">
              <p className="text-sm font-semibold">{address.current.name}</p>
              <p className="text-sm">{address.current.phone}</p>
              <p className="text-sm">{address.current.address.current}</p>
              <p className="text-sm">{address.current.zip}</p>
              <p className="text-sm">{address.current.city}</p>
              <p className="text-sm">{address.current.state || ""}</p>
              <p className="text-sm">{address.current.country || ""}</p>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-semibold p-4">Order Items</h1>

      {cart.map((product) => (
        <div
          key={product.id}
          className="flex justify-between items-center p-4 relative cursor-pointer"
          style={{
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          }}
          onClick={() => {
            navigate(`/product/${product.id}`);
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-[15%] h-[15%] lg:w-[13%] lg:h-[13%] object-cover rounded-lg"
          />
          <div className="flex flex-col justify-center items-start ml-4 gap-1">
            <p
              className="text-lg font-semibold text-gray-800"
              style={{
                fontSize: "1.3em",
                fontWeight: "bolder",
              }}
            >
              {product.name}
            </p>
            <p>Quantity: x{product.quantity}</p>

            <p className="text-sm text-gray-500">
              Category: {product.category}
            </p>
          </div>
          <p
            className="text-lg font-semibold"
            style={{
              color: "#ff0054",
            }}
          >
            ₹ {product.price * product.quantity}
          </p>

          {product.size && (
            <div className="absolute top-5 right-5">
              <span className="font-bold mr-2">Size: {product.size} </span>
            </div>
          )}
          <div
            className="px-2 py-1 cursor-pointer rounded-lg absolute bottom-2 right-2 text-sm sm:text-base active:scale-95 transform transition-transform"
            style={{
              backgroundColor: "#ff0054",
              color: "white",
              transition: "transform 0.1s",
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
            onClick={(e) => {
              e.stopPropagation(); // Stop event propagation
              dispatch(removeEntireItem(product));

              if (navigator.vibrate) {
                navigator.vibrate(100);
              }
            }}
          >
            <MdDeleteForever size={20} color="white" />
          </div>
        </div>
      ))}
      <div className="w-full text-right pr-4 pt-2">
        <span className="text-md ">
          Payment Processing Fee : ₹ {convenienceFees}
        </span>
      </div>

      <div className="flex justify-between items-center p-4">
        <p
          className="text-lg font-semibold"
          style={{
            fontSize: "1.3em",
            fontWeight: "bolder",
          }}
        >
          Total
        </p>

        <p
          className="text-2xl font-semibold"
          style={{
            color: "#ff0054",
          }}
        >
          ₹ {totalFinalPrice}
        </p>
      </div>
      {cart.reduce((total, item) => total + item.price * item.quantity, 0) >
      0 ? (
        address.current && (
          <div className="flex flex-col gap-4 p-4">
            <h1 className="text-xl font-semibold ">Choose Payment Method</h1>
            <div
              style={{
                marginTop: "1em",
                backgroundColor: "#ff9f00",
                color: "white",
                transition: "transform 0.1s",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
              className="text-center px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base w-[70%] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 m-auto"
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <TbTruckDelivery
                size={20}
                className="mr-2 inline-block align-middle"
                color="white"
              />
              <span>Pay on Delivery</span>
            </div>
            <div
              style={{
                backgroundColor: "#1CA672",
                color: "white",
                transition: "transform 0.1s",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
              }}
              className="text-center px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base w-[70%] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 m-auto"
              onClick={handlePayment}
            >
              <SiRazorpay
                size={20}
                className="mr-2 inline-block align-middle"
              />
              <span>Online Payment</span>
            </div>
          </div>
        )
      ) : (
        <div
          style={{
            transition: "transform 0.1s",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="w-[80%] text-center m-auto px-10 py-3 cursor-not-allowed rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base text-gray-500 bg-slate-400"
          onClick={() => {
            navigate("/cart");
          }}
        >
          <span>Cart is Empty</span>
        </div>
      )}
      {loading && (
        <PaymentProcessLoadScreen
          paymentloadscreenmessage={paymentloadscreenmessage}
          completed={completed}
          setCompleted={setCompleted}
          setLoading={setLoading}
        />
      )}
    </div>
  );
}
