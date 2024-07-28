import React, { useContext, useEffect, useState } from "react";
import TopPageDetail from "../../components/TopPageDetail";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase";
import { SessionContext } from "../../components/SessionContext";
import { useDispatch, useSelector } from "react-redux";
import { removeEntireItem } from "../../components/cartSlice";
import { MdDeleteForever } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
export default function OrderConfirm() {
  const [address, setAddress] = useState(null);
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAddress = async () => {
      if (session && session.user) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("address")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Error fetching address: ", error);
          } else if (data && data.address) {
            const address = JSON.parse(data.address);
            setAddress(address);
          }
        } catch (err) {
          console.error("Unexpected error: ", err);
        }
      }
    };

    fetchAddress();
  }, [session]);

  // When the user confirms the order get all the data and sent to a whatsapp number well formated about the address and the product details including link, then clear the cart
  const confirmOrder = async () => {
    const message = `🛒 Order Confirmed 🛒\n\n📦 Shipping Address 📦\n\nName: ${
      address.name
    }\nPhone: ${address.phone}\nAddress: ${address.address}\nZip: ${
      address.zip
    }\nCity: ${address.city}\nState: ${address.state || ""}\nCountry: ${
      address.country || ""
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

    // Clear the cart
    dispatch(removeEntireItem());
    navigate("/");
  };

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="Confirm Order" />
      {address && (
        <div className="p-4">
          <h1 className="text-2xl font-semibold">Order Summary</h1>
          <div className="mt-4">
            <h2 className="text-lg font-semibold">Shipping Address</h2>
            <div className="mt-2">
              <p className="text-sm font-semibold">{address.name}</p>
              <p className="text-sm">{address.phone}</p>
              <p className="text-sm">{address.address}</p>
              <p className="text-sm">{address.zip}</p>
              <p className="text-sm">{address.city}</p>
              <p className="text-sm">{address.state || ""}</p>
              <p className="text-sm">{address.country || ""}</p>
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
          ₹{" "}
          {cart.reduce((total, item) => total + item.price * item.quantity, 0)}
        </p>
      </div>
      {cart.reduce((total, item) => total + item.price * item.quantity, 0) >
      0 ? (
        <div
          style={{
            backgroundColor: "#ff9f00",
            color: "white",
            transition: "transform 0.1s",
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }}
          className="w-[80%] text-center m-auto px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
          onClick={confirmOrder}
        >
          <TbTruckDelivery
            size={20}
            className="mr-2 inline-block align-middle"
            color="white"
          />
          <span>Confirm Order</span>
        </div>
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
    </div>
  );
}
