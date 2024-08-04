import React, { useEffect, useState } from "react";
import TaqwaLogoRemoved from "../../images/taqwa-removed.png";
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
import { TopBar } from "../Landing/Landing";
import { PiInstagramLogoDuotone } from "react-icons/pi";

export const BeforeLogin = () => {
  const navigate = useNavigate();
  const transitionDuration = 500;

  const delayedNavigate = (path) => {
    setTimeout(() => {
      navigate(path);
    }, transitionDuration);
  };

  return (
    <div>
      <TopBar />
      <div className="flex flex-col overflow-x-hidden">
        <div
          className="w-screen grid md:grid-cols-2 grid-rows-2 md:grid-rows-1 overflow-x-hidden"
          style={{ height: "calc(100vh - 160px)" }} // Subtract the accurate combined height of the footer and the top bar
        >
          <div
            className="relative bg-cover bg-center cursor-pointer transform transition duration-500 hover:scale-105 active:scale-95 h-full"
            style={{
              backgroundImage:
                "url('https://ik.imagekit.io/taqwafashionstore/category/wristwatch-407096_1280.jpg')",
              zIndex: "1001",
            }}
            onClick={() => delayedNavigate("/home")}
          >
            <div
              className="absolute bottom-0 left-2-- m-4 text-white text-2xl"
              style={{
                fontFamily: "Grifter",
              }}
            >
              Fashion and Accessories
            </div>
          </div>
          <div
            className="relative bg-cover bg-center cursor-pointer transform transition duration-500 hover:scale-105 active:scale-95 h-full"
            style={{
              backgroundImage:
                "url('https://ik.imagekit.io/taqwafashionstore/category/pexels-pixabay-258244.jpg')",
              zIndex: "1001",
            }}
            onClick={() => delayedNavigate("/search?category=Perfumes")}
          >
            <div
              className="absolute bottom-2 left-2 m-4 text-white text-2xl"
              style={{
                fontFamily: "Grifter",
              }}
            >
              Fragrances
            </div>
          </div>
        </div>
        <footer className="bg-gray-800 text-white p-2">
          <div className="mx-auto px-6">
            <div className="flex justify-between items-center text-sm">
              <div>
                <h3 className="text-base">Contact Us</h3>
                <p className="mt-1">Phone: +91 9496990907</p>
                <p>
                  Address: Shopping Complex, Amballoor - Kanjiramattom Rd,
                  Kunnumpuram, Kanjiramattom, Kerala 682315
                </p>
              </div>
              <div>
                <a
                  href="https://www.instagram.com/taqwa_fashionstore_ekm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block"
                >
                  <PiInstagramLogoDuotone size={30} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
export default function Login() {
  const navigate = useNavigate();

  function signIn() {
    navigate("/loginStart");
  }

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
    <div className="page overflow-x-hidden page-login flex flex-col justify-between items-center h-screen bg-white relative pb-[3em] mb-[3em] ">
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
      <div className="cont-google text-center">
        <img
          src={TaqwaLogoRemoved}
          alt="TAQWA"
          className="m-auto "
          style={{
            zIndex: "10",
            position: "relative",
          }}
        />
        <span
          className="block logo-label text-black "
          style={{
            zIndex: "10",
            position: "relative",
          }}
        >
          FASHION STORE
        </span>
        <span
          style={{ zIndex: "10" }}
          className="block text-right text-[0.9em] text-black "
        >
          Walk out in style
        </span>
      </div>

      <span
        className="flex justify-center items-center gap-2 cont-google-btn mb-20 absolute bottom-16 px-6 py-4 text-blac bg-white rounded-2xl font-bold cursor-pointer text-xs flex-no-wrap border-2 border-black"
        onClick={signIn}
        style={{
          zIndex: "10",
          position: "relative",
          boxShadow:
            "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px",
        }}
      >
        <IoLogIn style={{ display: "block" }} size={23} color="black" />
        Login to Continue
      </span>
    </div>
  );
}
