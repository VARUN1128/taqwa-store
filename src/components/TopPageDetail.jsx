import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { MdContentCopy } from "react-icons/md";
import { PiShoppingCartSimpleLight } from "react-icons/pi";

export default function TopPageDetail({ title }) {
  const onBack = () => {
    window.history.back();
  };

  return (
    <div
      className="w-100 h-[5em] flex justify-center items-center relative px-4"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <MdArrowBackIosNew
        onClick={onBack}
        size={25}
        color="black"
        className="absolute left-4"
        style={{
          cursor: "pointer",
        }}
      />
      <h1
        className="text-xl text-center"
        style={{
          fontFamily: "Grifter",
        }}
      >
        {title}
      </h1>
    </div>
  );
}

export const TopProductDetail = ({ title, onCopy, onCart }) => {
  const onBack = () => {
    window.history.back();
  };

  return (
    <div
      className="w-100 h-[5em] flex justify-center items-center relative px-4"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
      }}
    >
      <MdArrowBackIosNew
        onClick={onBack}
        size={20}
        color="black"
        className="absolute left-4"
        style={{
          cursor: "pointer",
        }}
      />
      <h1
        className="text-l text-center"
        style={{
          fontFamily: "Product Sans",
        }}
      >
        {title}
      </h1>
      <div className="absolute right-4 flex space-x-3">
        <MdContentCopy
          size={25}
          style={{ cursor: "pointer" }}
          onClick={onCopy}
        />
        <PiShoppingCartSimpleLight
          size={25}
          style={{ cursor: "pointer" }}
          onClick={onCart}
        />
      </div>
    </div>
  );
};
