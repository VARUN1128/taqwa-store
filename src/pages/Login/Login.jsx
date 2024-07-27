import React from "react";
import TaqwaLogoRemoved from "../../images/taqwa-removed.png";
import CircularProgress from "@mui/material/CircularProgress";
import supabase from "../../supabase";
import { FaGoogle } from "react-icons/fa";
import { GiConverseShoe } from "react-icons/gi";
import { PiSneakerMove } from "react-icons/pi";
import { GiWatch } from "react-icons/gi";
import Crocs from "../../images/crocs.svg";
import Marquee from "react-marquee-slider";

const url = new URL(window.origin).href;

export default function Login() {
  const [loading, setLoading] = React.useState(false);
  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: url },
    });
    if (error) alert(error.message);
  }

  const items = [
    <GiConverseShoe size={70} />,
    <PiSneakerMove size={70} />,
    <GiWatch size={60} />,

    // <img src={Crocs} alt="Crocs" className="w-30 bg-red-500" />,
  ];
  return (
    <div className="page-login flex flex-col justify-between items-center h-screen">
      <Marquee velocity={100}>
        {items.map((item, index) => (
          <div key={index} style={{ marginRight: "100px" }}>
            {item}
          </div>
        ))}
      </Marquee>
      <div className="cont-google text-center ">
        <img src={TaqwaLogoRemoved} alt="TAQWA" />
        <span className="block logo-label">FASHION STORE</span>
        <span className="block text-right text-[0.9em]">Walk out in style</span>
      </div>
      <div style={{ transform: "rotate(180deg)" }}>
        <Marquee velocity={100}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{ marginRight: "100px", transform: "rotate(180deg)" }}
            >
              {item}
            </div>
          ))}
        </Marquee>
      </div>
      <span
        className="flex justify-center items-center gap-2 cont-google-btn mb-20 absolute bottom-2 px-6 py-4 text-white bg-black rounded-2xl font-bold cursor-pointer text-xs flex-no-wrap"
        onClick={signIn}
      >
        {loading ? (
          <CircularProgress style={{ color: "#fff" }} size={18} />
        ) : (
          <>
            <FaGoogle style={{ display: "block" }} size={20} color="#fff" />
          </>
        )}
        Continue With Google
      </span>
    </div>
  );
}
