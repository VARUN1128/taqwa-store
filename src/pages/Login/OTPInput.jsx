import React, { useState, useRef } from 'react';

const OTPInput = ({ otpSent ,otp,setOtp}) => {
  
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus the next input box if the current one is filled
    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className={`flex gap-1  ${otpSent? '': 'hidden'}` }>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className={`z-20 cont-google-btn  w-10 h-10 text-black bg-white rounded-2xl text-lg font-bold border-2 outline-none transition-opacity duration-500 ease-in-out text-center ${
            otpSent ? "border-black opacity-100" : "border-gray-300 opacity-0"
          }`}
          disabled={!otpSent}
        />
      ))}
    </div>
  );
};

export default OTPInput;