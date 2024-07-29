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
  const [test, setTest] = useState(null);

  const getPaymentResponseOnSuccess = async (paymentId, orderId, signature) => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
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
            orderId,
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
          Use the order id to contact the support team: ${orderId},
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
        const orderId = response.razorpay_order_id;
        await getPaymentResponseOnSuccess(paymentId, orderId, signature);
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
    setTest("test");
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

    const url = `https://api.whatsapp.com/send?phone=+918281931488&text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
    dispatch(removeEntireItem());
    navigate("/");
  };

  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="Confirm Order" />
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
              onClick={whatsAppPayment}
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
