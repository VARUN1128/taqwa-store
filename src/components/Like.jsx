import React from "react";
import "./Like.css";

const Like = ({ checked, size, onClick }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    onClick && onClick();
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="heart-container"
      title="Like"
      style={{
        width: size,
        height: size,
      }}
    >
      <input type="checkbox" className="checkbox" checked={checked} readOnly />
      <div className="svg-container ">
        <svg
          viewBox="-2 -2 28 28" // Adjust these values
          className="svg-heart"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
        </svg>
        <svg
          className="svg-celebrate"
          width="100"
          height="100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon points="10,10 20,20"></polygon>
          <polygon points="10,50 20,50"></polygon>
          <polygon points="20,80 30,70"></polygon>
          <polygon points="90,10 80,20"></polygon>
          <polygon points="90,50 80,50"></polygon>
          <polygon points="80,80 70,70"></polygon>
        </svg>
      </div>
    </div>
  );
};

export default Like;
