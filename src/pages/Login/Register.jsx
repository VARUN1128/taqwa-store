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

export default function RegisterStart() {
  const [loading, setLoading] = React.useState(false);

  async function register() {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: "+918921511945",
    });

    if (error) {
      console.log(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  }
  const navigate = useNavigate();

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
        <input
          type="text"
          placeholder="Full Name"
          className="  z-20  cont-google-btn px-5 w-[22em] mb-3 py-4 text-black bg-white rounded-2xl text-xs  border-2 border-black outline-none"
          style={{
            position: "relative", // Remove absolute positioning
          }}
        />
        <input
          type="number"
          placeholder="Phone Number"
          className="  z-20  cont-google-btn px-5 w-[22em] mb-3 py-4 text-black bg-white rounded-2xl text-xs  border-2 border-black outline-none"
          style={{
            position: "relative", // Remove absolute positioning
          }}
        />
        <input
          type="number"
          placeholder="OTP"
          className="z-20  cont-google-btn px-5 w-[22em]  py-4 text-blac bg-white rounded-2xl text-xs  border-2 border-black outline-none"
          style={{
            position: "relative", // Remove absolute positioning
          }}
        />
        <div className=" mb-10 flex justify-between text-center w-[22em] text-xs text-black">
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/loginStart")}
          >
            Already have an account?
          </span>
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            Continue without login
          </span>{" "}
        </div>
        <span
          className="flex justify-center items-center gap-2 cont-google-btn  absolute bottom-2 px-16 py-4 text-blac bg-white rounded-2xl font-bold cursor-pointer text-xs flex-no-wrap border-2 border-black"
          onClick={register}
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
          Register
        </span>
      </div>
    </div>
  );
}
