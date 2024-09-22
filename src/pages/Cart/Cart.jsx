import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopPageDetail from "../../components/TopPageDetail";
import { MdDeleteForever } from "react-icons/md";
import { removeEntireItem, addSize } from "../../components/cartSlice";
import EmptyCart from "../../images/empty_cart.svg";
import { TbTruckDelivery } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
        <TopPageDetail title="Cart" />
        <div className="empty-cart text-center">
          <img
            src={EmptyCart}
            alt="Empty Cart"
            style={{
              width: "50%",
              height: "50%",
              objectFit: "contain",
              margin: "2em auto",
            }}
          />
          <p>😪 Your Cart is empty. Add some items to the cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em]">
      <TopPageDetail title="Cart" />
      <ToastContainer />
      {/* Render your cart items here */}
      {cart.map((product) => (
        <div
          key={product.id}
          className="flex justify-between items-center p-4 relative "
          style={{
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-[30%] h-[30%] lg:w-[13%] lg:h-[13%] object-cover rounded-lg cursor-pointer"
            onClick={() => {
              navigate(`/product/${product.id}`);
            }}
          />
          <div
            className="flex flex-col justify-center items-start ml-4 gap-1 cursor-pointe"
            onClick={() => {
              navigate(`/product/${product.id}`);
            }}
          >
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
            {!product.cod_price && (
              <div
                className="product-action justify-center items-center w-full flex m-auto gap-3 mt-2 text-sm"
                style={{
                  color: "#ff0054",
                  fontFamily: "Product Sans",
                }}
              >
                <span>Cash On Delivery Not Available For This Item</span>
              </div>
            )}
          </div>
          <p
            className="text-md font-semibold "
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
          ₹{" "}
          {cart.reduce((acc, product) => {
            return (
              acc +
              (product.priceMap
                ? product.priceMap[product.size] * product.quantity
                : product.price * product.quantity)
            );
          }, 0)}
        </p>
      </div>
      <div
        style={{
          backgroundColor: "#ff9f00",
          color: "white",
          transition: "transform 0.1s",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
        className="w-[80%] text-center m-auto px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
        onClick={() => {
          console.log(cart);
          navigate("/address");
        }}
      >
        <TbTruckDelivery
          size={20}
          className="mr-2 inline-block align-middle"
          color="white"
        />
        <span>Add Delivery Address</span>
      </div>
    </div>
  );
};

export default Cart;
