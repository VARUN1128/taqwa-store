import React, { useState, useRef } from "react";

const OTPInput = ({ otpSent, otp, setOtp }) => {
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const otpLength = Math.min(pastedData.length, 6);

    const newOtp = [...otp];
    for (let i = 0; i < otpLength; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input
    if (otpLength > 0) {
      inputRefs.current[otpLength - 1].focus();
    }
  };

  return (
    <div className={`flex gap-1  ${otpSent ? "" : "hidden"}`}>
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : null}
          ref={(el) => (inputRefs.current[index] = el)}
          // Add these attributes for OTP autofill
          autoComplete={index === 0 ? "one-time-code" : "off"}
          inputMode="numeric"
          pattern="[0-9]*"
          className={`z-20 cont-google-btn w-10 h-10 text-black bg-white rounded-2xl text-lg font-bold border-2 outline-none transition-opacity duration-500 ease-in-out text-center ${
            otpSent ? "border-black opacity-100" : "border-gray-300 opacity-0"
          }`}
          disabled={!otpSent}
        />
      ))}
    </div>
  );
};

export default OTPInput;
