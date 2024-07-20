import React from "react";
import Clock from "../../components/clock";
import TaqwaLogoRemoved from "../../images/taqwa-removed.png";
import CircularProgress from "@mui/material/CircularProgress";
import supabase from "../../supabase";
import { FaGoogle } from "react-icons/fa";

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

  return (
    <div className="page-login ">
      <div className="cont-google text-center ">
        <img src={TaqwaLogoRemoved} alt="TAQWA" />
        <span className="block logo-label">FASHION STORE</span>
        <span className="block text-right text-[0.9em]">Walk out in style</span>
      </div>
      <span
        className=" flex justify-center items-center gap-[10px]
      cont-google-btn mb-20 absolute  bottom-[2em]  px-6 py-4 text-white bg-black rounded-2xl font-bold cursor-pointer text-[0.7em] "
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
