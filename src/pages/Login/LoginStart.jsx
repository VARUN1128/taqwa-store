import React, { useEffect, useState } from "react";
import TaqwaLogoRemoved from "../../images/taqwa-removed.png";
import CircularProgress from "@mui/material/CircularProgress";
import supabase from "../../supabase";
import { GiConverseShoe } from "react-icons/gi";
import { PiSneakerMove } from "react-icons/pi";
import { GiWatch } from "react-icons/gi";
import Marquee from "react-marquee-slider";
import { TbPerfume } from "react-icons/tb";
import { GiDelicatePerfume } from "react-icons/gi";
import { PiBaseballCap } from "react-icons/pi";
import { PiBaseballCapThin } from "react-icons/pi";
import { IoWalletOutline } from "react-icons/io5";
import { TbShoe } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { IoLogIn } from "react-icons/io5";
import ConversePNG from "../../images/converse.png";
import CapPng from "../../images/cap.png";
import PerfumePng from "../../images/perfume.png";
import CrocsPng from "../../images/crocs.png";
import { LiaArrowAltCircleLeftSolid } from "react-icons/lia";
import { AiFillGoogleCircle, AiOutlineRightCircle } from "react-icons/ai";
import OTPInput from "./OTPInput";
import { Turnstile } from "@marsidev/react-turnstile";
const url = new URL(window.origin).href;

export default function LoginStart() {
  const [loading, setLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [showSendOtp, setShowSendOtp] = React.useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [captchaToken, setCaptchaToken] = useState("");

  const [phoneNumber, setPhoneNumber] = useState(""); // Add state for the phone number

  const [userInfo, setUserInfo] = useState(null);

  async function signIn() {
    setLoading(true);
  }
  const navigate = useNavigate();

  const sendOTP = async () => {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: `+91${phoneNumber}`,
      options: {
        captchaToken: captchaToken,
      },
    });
    if (error) {
      console.log(error);
      return;
    }
    console.log(data);
  };

  const verifyOTP = async () => {
    console.log(otp.join(""));
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.verifyOtp({
      phone: `+91${phoneNumber}`,
      token: otp.join(""),
      type: "sms",
      options: {
        captchaToken: captchaToken,
      },
    });

    if (error) {
      console.log(error);
      return;
    }
    console.log(session);
  };

  const signInGoogle = async () => {
    const { user, session, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: url,
        captchaToken: captchaToken,
      },
    });
    if (error) {
      console.log(error);
      return;
    }
    console.log("User", user);
  };

  const items = [
    <GiConverseShoe size={40} color="black" />,
    <PiSneakerMove size={40} color="black" />,
    <GiWatch size={40} color="black" />,
    <PiBaseballCap size={40} color="black" />,
    <TbShoe size={40} color="black" />,
    <TbPerfume size={40} color="black" />,
    <GiDelicatePerfume size={40} color="black" />,
    <IoWalletOutline size={40} color="black" />,
    <PiBaseballCapThin size={40} color="black" />,
  ];
  return (
    <div className="page overflow-x-hidden overflow-y-scroll page-login flex flex-col justify-between items-center h-screen bg-white relative pb-[3em] mb-[3em] ">
      <img
        src={ConversePNG}
        alt="Converse Image"
        style={{
          width: "8em",
          position: "absolute",
          bottom: "6em",
          left: "1em",
          transform: "rotate(20deg)",
          zIndex: "1",
        }}
      />
      <img
        src={CapPng}
        alt="Cap Image"
        style={{
          width: "6em",
          position: "absolute",
          bottom: "10em",
          right: "3em",
          transform: "rotate(20deg)",
          zIndex: "1",
        }}
      />
      <img
        src={CrocsPng}
        alt="Crocs Image"
        style={{
          width: "8em",
          position: "absolute",
          bottom: "13em",
          left: "3em",
          transform: "rotate(-20deg)",
          zIndex: "1",
        }}
      />

      <img
        src={PerfumePng}
        alt="Perfume Image"
        style={{
          width: "6em",
          position: "absolute",
          bottom: "27em",
          right: "3em",
          transform: "rotate(-10deg)",
          zIndex: "1",
        }}
      />
      <Marquee velocity={70}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              marginRight: "10em",
              paddingTop: "5em",
              zIndex: "10",
              position: "relative",
            }}
          >
            {item}
          </div>
        ))}
      </Marquee>
      <div className=" cont-google mb-32 border-2 rounded-lg border-black py-2 px-5 bg-white z-20 flex flex-col justify-center items-center gap-2">
        <LiaArrowAltCircleLeftSolid
          size={30}
          color="black"
          className="absolute top-2 left-2 cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <img
          src={TaqwaLogoRemoved}
          alt="TAQWA"
          className="m-auto"
          style={{
            zIndex: "10",
            position: "relative",
            width: "10em", // Set the width to 13em
          }}
        />
        <span
          className="block logo-label text-black"
          style={{
            zIndex: "10",
            position: "relative",
          }}
        >
          FASHION STORE
        </span>
        <span
          style={{ zIndex: "10" }}
          className="block text-right text-[0.9em] text-black"
        >
          Walk out in style
        </span>
        <div className="flex flex-col items-center justify-center gap-2">
          <div
            className={`border-2 rounded-2xl
                          flex w-[16em] self-center 
                          ${showSendOtp ? "border-green-600" : "border-black"}
                          `}
          >
            <div
              className={`flex text-center items-center 
                          justify-center w-1/4 text-lg 
                           border-r-2 border-black
                           ${
                             showSendOtp ? "border-green-600" : "border-black"
                           }`}
            >
              +91
            </div>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber} // Set the value to the phone number state
              maxLength={10}
              disabled={otpSent}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                if (e.target.value.length === 10) {
                  setShowSendOtp(true);
                } else {
                  setShowSendOtp(false);
                  setOtpSent(false);
                  setLoading(false);
                }
              }} // Update the state when the input changes
              className="z-20 cont-google-btn w-3/4 f h-12 text-black bg-white rounded-2xl text-lg text-center  outline-none "
              style={{
                paddingRight: "30px", // Add padding to make room for the icon
              }}
            />
          </div>
          <div
            className={`text-xs text-black text-center w-[20em] ${
              otpSent ? "hidden" : ""
            }`}
          >
            We will send you a one time password on this phone number
          </div>
          <OTPInput otpSent={otpSent} otp={otp} setOtp={setOtp} />
          <div
            className={`w-24 h-10 p-3 rounded-xl text-center flex bg-black text-white font-bold items-center justify-center cursor-pointer transition-opacity duration-300 ease-in-out ${
              showSendOtp ? "opacity-100 " : "opacity-0 hidden"
            }
              ${
                otpSent
                  ? "bg-gray-300 text-black cursor-not-allowed"
                  : "bg-black text-white"
              }
              `}
            onClick={() => {
              setOtpSent(true);
              sendOTP();
            }}
          >
            {otpSent ? "Resend" : "Send OTP"}
          </div>

          <div>
            <span
              className="text-xs text-black cursor-pointer"
              onClick={() => {
                setPhoneNumber("");
                setShowSendOtp(false);
                setOtpSent(false);
                setLoading(false);
              }}
            >
              Change Phone Number
            </span>
          </div>
        </div>

        <span
          className={` mt-5 flex justify-center 
                      items-center gap-2 cont-google-btn  
                      absolute bottom-2 w-32 h-14
                      text-blac bg-white rounded-2xl
                       font-bold cursor-pointer text-xs 
                       flex-no-wrap border-2 border-black
                       ${otpSent ? "opacity-100" : "opacity-0 hidden"}
                       `}
          onClick={verifyOTP}
          style={{
            zIndex: "10",
            position: "relative",
            boxShadow:
              "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
          }}
        >
          {loading ? (
            <CircularProgress style={{ color: "black" }} size={18} />
          ) : (
            <>
              <IoLogIn style={{ display: "block" }} size={23} color="black" />
            </>
          )}
          Login
        </span>
        <div className=" mb-5  text-center w-[22em] text-xs text-black">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>{" "}
          <AiFillGoogleCircle
            size={30}
            color="black"
            style={{
              textAlign: "center",
              margin: "auto",
              zIndex: "10",
              marginTop: "1em",
              cursor: "pointer",
            }}
            onClick={signInGoogle}
          />
        </div>
      </div>
      <Turnstile
        siteKey={process.env.REACT_APP_CLOUDFLARE_SITE_KEY}
        className="absolute bottom-20 right-0 z-20"
        onSuccess={(token) => {
          setCaptchaToken(token);
        }}
      />
    </div>
  );
}
