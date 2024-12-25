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
import CircularProgress from "@mui/material/CircularProgress";
import { MdCheckCircleOutline } from "react-icons/md";
import { BsCartCheckFill } from "react-icons/bs";
import { toast } from "react-toastify";
import QRCode from "qrcode";
import { IoCloseCircle } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import {
  SiGooglepay,
  SiPhonepe,
  SiPaytm,
  SiAmazon,
  SiPaypal,
} from "react-icons/si";

const UPI_ICONS = [
  { icon: SiGooglepay },
  { icon: SiPhonepe },
  { icon: SiPaytm },
  { icon: SiAmazon },
  { icon: SiPaypal },
];

const QrCodeModal = ({
  onClose,
  upiLink,
  cart,
  totalFinalPrice,
  userInfo,
  onDone,
}) => {
  const [qrCodeImage, setQrCodeImage] = useState("");
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const whatsappNumber = "+91 7558856844";

  const cartItemsMessage = cart.map((item) => {
    const itemName = `Name: ${item.name}`;
    const itemSize = item.size ? `Size: ${item.size}` : "";
    const itemQuantity = `Quantity: ${item.quantity}`;
    const itemPrice = `Price: ₹${
      item.priceMap ? item.priceMap[item.size] : item.price
    }`;
    const itemLink = `Product Link: ${window.location.origin}/product/${item.id}#top`;

    return `${itemName}\n${itemSize}\n${itemQuantity}\n${itemPrice}\n${itemLink}`;
  });

  const cartItemsMessageString = cartItemsMessage.join("\n\n");

  const address = `${userInfo.name}\n ${userInfo.phone}\n${userInfo.address}, ${userInfo.zip}, ${userInfo.post}\n ${userInfo.city}\n ${userInfo.whatsapp}\n ${userInfo.state}\n${userInfo.country}\n`;

  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const qrCode = await QRCode.toDataURL(upiLink, {
          errorCorrectionLevel: "H",
          width: 300,
          color: { dark: "#000000", light: "#ffffff" },
        });
        setQrCodeImage(qrCode);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQrCode();

    const interval = setInterval(() => {
      setCurrentIconIndex((prev) => (prev + 1) % UPI_ICONS.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [upiLink]);

  const openWhatsapp = () => {
    const message = encodeURIComponent(
      "Here's my payment screenshot for order: \n " +
        cartItemsMessageString +
        `\n\nTotal Price: *₹${totalFinalPrice}* \n\nAddress: \n${address}`
    );
    window.open(
      `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${message}`
    );

    setShowFollowUp(true);
    setTimeout(() => setFadeIn(true), 100);
  };

  const CurrentIcon = UPI_ICONS[currentIconIndex].icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg relative w-full max-w-md my-8">
        <button onClick={onClose} className="absolute top-2 right-2 z-10">
          <IoCloseCircle size={28} color="red" />
        </button>

        <div className="p-4 sm:p-6 space-y-4">
          {!showFollowUp ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold text-center">
                Payment Instructions
              </h2>

              <div className="flex justify-center">
                {qrCodeImage && (
                  <img
                    src={qrCodeImage}
                    alt="UPI QR Code"
                    className="w-48 sm:w-64 h-auto"
                  />
                )}
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-1">Option 1: Scan QR Code</h3>
                  <p className="text-sm text-gray-600">
                    Open any UPI app and scan the QR code above
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold mb-1">
                    Option 2: Pay Directly to Bank Account
                  </h3>
                  <p className="text-gray-600">
                    Account Details: M/S. Taqwa Fashion Store And Taqwa Gadgets
                    <br />
                    AC No: <span className="select-all">0032073000000424</span>
                    <br />
                    IFSC CODE: <span className="select-all">SIBL0000032</span>
                    <br /> BANK: SOUTH INDIAN BANK (SIB)
                  </p>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-600">
                  After payment, send screenshot to:
                  <span className="font-semibold block">{whatsappNumber}</span>
                </p>
                <button
                  onClick={openWhatsapp}
                  className="mt-2 w-full bg-green-500 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-green-600"
                >
                  <FaWhatsapp size={20} />
                  <span>Send Screenshot on WhatsApp</span>
                </button>
              </div>
            </>
          ) : (
            <div
              className={`text-center py-8 space-y-4 transition-opacity duration-500 ${
                fadeIn ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <FaWhatsapp size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Thank You for Your Order!
              </h2>
              <p className="text-gray-600">
                We've opened WhatsApp for you to send your payment confirmation.
                All further communications regarding your order will be handled
                through WhatsApp.
              </p>
              <p className="text-gray-600">
                Our team will process your order once we receive your payment
                screenshot.
              </p>
              <button
                onClick={onDone}
                className="mt-4 px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function Modal({ isOpen, onClose, onConfirm, cod_charge }) {
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async () => {
    setConfirming(true);
    setErrorMessage("");
    try {
      const status = await onConfirm();
      if (status === "success") {
        setConfirmed(true);
        setTimeout(() => {
          onClose();
          navigate("/orders");
        }, 2000);
      } else {
        setErrorMessage("Something went wrong, please try again.");
      }
    } catch (error) {
      setErrorMessage("Something went wrong, please try again.");
    } finally {
      setConfirming(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full mb-8">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  <span className="bg-red-500 text-white p-0.5 mb-2">
                    Cash on Delivery Charge: (Extra) <b>₹ {cod_charge}</b>.
                  </span>
                  <br></br>
                  <span className="bg-green-500 p-0.5 text-white">
                    🎁 Free Gifts Available only for Online Payment
                  </span>
                  <br></br> You can track the order in Orders Page
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {!confirming && !confirmed && (
              <button
                type="button"
                className="w-full inline-flex text-bold justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleConfirm}
              >
                <BsCartCheckFill size={20} className="mr-2" />
                Confirm
              </button>
            )}
            {confirming && (
              <div className="flex justify-center items-center w-full">
                <CircularProgress style={{ color: "#10B981" }} size={24} />
              </div>
            )}
            {confirmed && (
              <div className="flex flex-col justify-center items-center w-full">
                <MdCheckCircleOutline
                  style={{ color: "#10B981", fontSize: 40 }}
                />
                <p className="mt-2 text-green-700 font-medium">
                  Order Confirmed
                </p>
              </div>
            )}
            {!confirming && !confirmed && (
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
                disabled={confirming}
              >
                No
              </button>
            )}
          </div>
          {errorMessage && (
            <div className="text-center text-red-500 mt-2">{errorMessage}</div>
          )}
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
  const [OrderConfirmed, setOrderConfirmed] = useState(true);

  const [ShowQrModal, setShowQrModal] = useState(false);
  const [qrCodeImage, setqrCodeImage] = useState(null);
  const [upiQrLink, setUpiQrLink] = useState(null);

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
    cart.reduce((acc, product) => {
      return (
        acc +
        (product.priceMap
          ? product.priceMap[product.size] * product.quantity
          : product.price * product.quantity)
      );
    }, 0) * 0.02
  ).toFixed(2);

  convenienceFees = parseFloat(convenienceFees);

  const totalFinalPrice = Object.values(cart).reduce(
    (total, item) =>
      total +
      (item.priceMap
        ? item.priceMap[item.size] * item.quantity
        : item.price * item.quantity),
    0
  );

  // const cod_charge = Object.values(cart).reduce(
  //   (total, item) => total + (item.cod_price ? item.cod_price : 0),
  //   0
  // );

  const cod_charge = Object.values(cart).reduce((total, item) => {
    const codPrice =
      item.codPriceMap && item.size
        ? item.codPriceMap[item.size]
        : item.cod_price;
    return total + (codPrice ? codPrice * item.quantity : 0);
  }, 0);

  useEffect(() => {
    cart.forEach((product) => {
      if (product.codPriceMap) {
        console.log("Price Map for product:", product.codPriceMap);
        console.log(product.codPriceMap[product.size]);
      }
    });
  }, [cart]);

  const createOrder = async () => {
    console.log("Address", address.current);
    const response = await axios.post(
      `${BACKEND_URL}/create-order`,
      {
        description: "Payment for accessories",
        user_id: session.user.id,
        user_name: avatarInfo.full_name,
        items: cart,
        address: address.current,
        payment_method: "Razorpay",
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

  const qrPayment = async () => {
    console.log("Its on");
    const payeeName = "TAQWA FASHION STORE & TAQWA GADGETS";
    const payeeUPI = "Q50267725@ybl";
    const payeeAmount = totalFinalPrice;
    const payeeCurrency = "INR";

    const payeeNote = `Payment for ${cart.map((item) => item.name).join(", ")}`;

    const maxLength = 50;
    const trimmedPayeeNote =
      payeeNote.length > maxLength
        ? `${payeeNote.substring(0, maxLength - 3)}...`
        : payeeNote;

    const upiLink = `upi://pay?pa=${encodeURIComponent(
      payeeUPI
    )}&pn=${encodeURIComponent(payeeName)}&mc=&tid=&tr=&tn=${encodeURIComponent(
      trimmedPayeeNote
    )}&am=${encodeURIComponent(payeeAmount)}&cu=${encodeURIComponent(
      payeeCurrency
    )}`;

    //display the qrcode on the page

    setShowQrModal(true);
    setUpiQrLink(upiLink);
  };

  const cashOnDelivey = async () => {
    const response = await axios.post(
      `${BACKEND_URL}/create-order`,
      {
        description: "Payment for accessories",
        user_id: session.user.id,
        user_name: avatarInfo.full_name,
        items: cart,
        address: address.current,
        status: "paid",
        payment_method: "COD",
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
    dispatch(removeEntireItem());
    return response.status === 200 ? "success" : "error";
  };

  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[6em]">
      <TopPageDetail title="Confirm Order" />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={cashOnDelivey}
        cod_charge={cod_charge}
      />
      {ShowQrModal && (
        <QrCodeModal
          cart={cart}
          upiLink={upiQrLink}
          onClose={() => {
            console.log("closing");
            console.log(ShowQrModal);
            setShowQrModal(false);
          }}
          onDone={() => {
            dispatch(removeEntireItem());
            navigate("/");
          }}
          totalFinalPrice={totalFinalPrice}
          userInfo={address.current}
        />
      )}
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
              <p className="text-sm">{address.current.post}</p>
              <p className="text-sm">{address.current.city}</p>
              <p className="text-sm">{address.current.whatsapp}</p>
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
            <p>
              Quantity: <span className="font-bold">x{product.quantity}</span>
            </p>
            {product.size !== 0 && (
              <p>
                Size: <span className="font-bold">{product.size}</span>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Category: {product.category}
            </p>
          </div>
          <p
            className="text-lg font-semibold"
            style={{
              color: "black",
            }}
          >
            ₹{" "}
            {product.priceMap
              ? product.priceMap[product.size] * product.quantity
              : product.price * product.quantity}
          </p>

          <div
            className="px-2 py-1 cursor-pointer rounded-lg absolute bottom-2 right-2 text-sm sm:text-base active:scale-95 transform transition-transform"
            style={{
              backgroundColor: "black",
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
        {/* <span className="text-md ">
          Payment Processing Fee : ₹ {convenienceFees}
        </span> */}
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
            color: "black",
          }}
        >
          ₹ {totalFinalPrice}
        </p>
      </div>

      {cart.some(
        (product) =>
          product.cod_price == null &&
          (!product.codPriceMap ||
            !product.size ||
            product.codPriceMap[product.size] == null ||
            product.codPriceMap[product.size] === undefined)
      ) ? (
        <span
          className="ml-4 text-xs"
          style={{
            color: "red",
          }}
        >
          Cash On Delivery Not Available For{" "}
          {
            cart.find(
              (product) =>
                product.cod_price == null &&
                (!product.codPriceMap ||
                  !product.size ||
                  product.codPriceMap[product.size] == null ||
                  product.codPriceMap[product.size] === undefined)
            ).name
          }
        </span>
      ) : (
        <span className="ml-4 text-lg">
          <span
            className="px-1"
            style={{
              backgroundColor: "#1CA672",
              color: "white",
              borderRadius: "5em",
              display: "inline-block",
              marginBottom: "0.2em",
            }}
          >
            🎁 Get Free Gifts On Online Payment!
          </span>
          <br />
          <span
            className="bg-red-500 ml-4 px-1"
            style={{
              color: "white",
              borderRadius: "5em",
              display: "inline-block",
              marginTop: "0.5em",
            }}
          >
            Cash On Delivery Charge Extra ₹ <b>{cod_charge}</b>
          </span>
        </span>
      )}

      {cart.length > 0 ? (
        address.current && (
          <div className="flex flex-col gap-4 p-4">
            <h1 className="text-xl font-semibold ">Choose Payment Method</h1>
            <div
              style={{
                backgroundColor: "#1CA672",
                color: "white",
                transition: "transform 0.1s",
                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                marginTop: "1em",
                disabled: true,
                // backgroundColor: "gray",
                // opacity: "0.5",
              }}
              className="text-center px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base w-[70%] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 m-auto"
              onClick={qrPayment}
            >
              <SiRazorpay
                size={20}
                className="mr-2 inline-block align-middle"
              />
              <span>Online Payment</span>
            </div>

            {!cart.some(
              (product) =>
                product.cod_price === null &&
                (!product.codPriceMap ||
                  !product.size ||
                  product.codPriceMap[product.size] === null)
            ) && (
              <div
                style={{
                  // backgroundColor: "#ff9f00",
                  color: "white",
                  transition: "transform 0.1s",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }}
                className=" bg-red-500 text-center px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base w-[70%] sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 m-auto"
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                <TbTruckDelivery
                  size={20}
                  className="mr-2 inline-block align-middle"
                  color="white"
                />
                <span>Cash on Delivery</span>
              </div>
            )}
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
