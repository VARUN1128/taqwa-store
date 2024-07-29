import React from "react";
import TaqwaLogoRemoved from "../../images/taqwa-removed.png";
import CircularProgress from "@mui/material/CircularProgress";
import supabase from "../../supabase";
import { FaGoogle } from "react-icons/fa";
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
import FragnanceImage from "../../images/fragnance.jpg";
import Accessories from "../../images/accessories.jpg";
import { useNavigate } from "react-router-dom";

export const BeforeLogin = () => {
  const navigate = useNavigate();
  return (
    <div className="page">
      <div
        className="grid md:grid-cols-2 h-screen overflow-hidden cursor-pointer "
        style={{
          fontFamily: "Grifter",
          letterSpacing: "0.05em",
        }}
      >
        <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url(${Accessories})` }}
          onClick={() => navigate("/home")}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
          <h2 className="absolute bottom-0 mb-4 ml-4 text-white text-2xl">
            Fashion And Accessories
          </h2>
        </div>
        <div
          className="relative bg-cover bg-center"
          style={{ backgroundImage: `url(${FragnanceImage})` }}
          onClick={() => navigate("/search?category=Perfumes")}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
          <h2 className="absolute bottom-0 mb-4 ml-4 text-white text-2xl">
            Fragnance And Beauty
          </h2>
        </div>
      </div>
    </div>
  );
};
// const url = new URL(window.origin).href;

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  async function signIn() {
    const url = new URL(window.origin).href;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: url },
    });
    if (error) alert(error.message);
  }

  const items = [
    <GiConverseShoe size={40} color="white" />,
    <PiSneakerMove size={40} color="white" />,
    <GiWatch size={40} color="white" />,
    <PiBaseballCap size={40} color="white" />,
    <TbShoe size={40} color="white" />,
    <TbPerfume size={40} color="white" />,
    <GiDelicatePerfume size={40} color="white" />,
    <IoWalletOutline size={40} color="white" />,
    <PiBaseballCapThin size={40} color="white" />,

    // <img src={Crocs} alt="Crocs" className="w-30 bg-red-500" />,
  ];
  return (
    <div className="page page-login flex flex-col justify-between items-center h-screen bg-black">
      <Marquee velocity={70}>
        {items.map((item, index) => (
          <div key={index} style={{ marginRight: "10em", paddingTop: "5em" }}>
            {item}
          </div>
        ))}
      </Marquee>
      <div className="cont-google text-center ">
        <img src={TaqwaLogoRemoved} alt="TAQWA" className="m-auto" />
        <span className="block logo-label text-white ">FASHION STORE</span>
        <span className="block text-right text-[0.9em] text-white ">
          Walk out in style
        </span>
      </div>
      <div style={{ transform: "rotate(180deg)" }}></div>
      <span
        className="flex justify-center items-center gap-2 cont-google-btn mb-20 absolute bottom-2 px-6 py-4 text-blac bg-white rounded-2xl font-bold cursor-pointer text-xs flex-no-wrap"
        onClick={signIn}
      >
        {loading ? (
          <CircularProgress style={{ color: "black" }} size={18} />
        ) : (
          <>
            <FaGoogle style={{ display: "block" }} size={20} color="black" />
          </>
        )}
        Continue With Google
      </span>
    </div>
  );
}
