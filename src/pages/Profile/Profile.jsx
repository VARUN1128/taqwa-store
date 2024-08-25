import React, { useContext } from "react";
import TopPageDetail from "../../components/TopPageDetail";
import { SessionContext } from "../../components/SessionContext";
import { PiHeart } from "react-icons/pi";
import { IoBagCheckOutline } from "react-icons/io5";
import { BsPatchQuestion } from "react-icons/bs";
import { FiPhoneCall } from "react-icons/fi";
import supabase from "../../supabase";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const Profile = () => {
  const { session } = useContext(SessionContext);
  const [loading, setLoading] = React.useState(false);
  const avatarInfo = session?.user.user_metadata;
  const userName = avatarInfo?.name || "Anonymous";
  const avatarPic =
    avatarInfo?.avatar_url ||
    `https://api.dicebear.com/9.x/adventurer/svg?mouth=variant23&seed=${userName}&eyebrows=variant10&skinColor=f2d3b1&backgroundColor=ff0054`;
  const avatarEmail = avatarInfo?.email;

  const navigate = useNavigate();
  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    navigate("/home");
  };

  return (
    <div className="page">
      <TopPageDetail title="Profile" />
      <div className="flex flex-row items-center mt-5 ml-5">
        <img src={avatarPic} alt="Profile" className="h-20 w-20 rounded-full" />
        <div className="ml-4">
          <h1 className="text-xl mt-4">{userName}</h1>
          <span className=" mt-2 block text-gray-600 text-sm">
            {avatarEmail}
          </span>
        </div>
      </div>
      <div
        onClick={() => {
          session ? logout() : navigate("/login");
        }}
        className="m-auto mt-10 w-fit py-3 px-20 rounded-xl bg-gray-300 cursor-pointer "
      >
        {loading ? (
          <CircularProgress style={{ color: "#000" }} size={20} />
        ) : session ? (
          "Log Out"
        ) : (
          "Log In / Sign Up"
        )}
      </div>
      <div className="w-full bg-gray-500 h-[1px] mt-5"></div>
      <h1 className="text-2xl ml-2 mt-3">Personal</h1>
      <div className="flex flex-col gap-6 mt-5 ml-5">
        <div
          className="flex gap-2 cursor-pointer "
          onClick={() => navigate("/wishlist")}
        >
          <PiHeart size={30} color="black" />
          <span className="pt-1 font-bold">My Wishlist</span>
        </div>
        <div
          className="flex gap-2 cursor-pointer "
          onClick={() => navigate("/orders")}
        >
          <IoBagCheckOutline size={30} color="black" />
          <span className="pt-1 font-bold "> My Orders</span>
        </div>
      </div>
      <div className="w-full bg-gray-500 h-[1px] mt-5"></div>
      <h1 className="text-2xl ml-2 mt-3">Support</h1>
      <div
        className="flex flex-col gap-6 mt-5 ml-5"
        onClick={() => {
          window.open("https://wa.me/+919496990907");
        }}
      >
        <div className="flex gap-2 cursor-pointer">
          <BsPatchQuestion size={30} color="black" />
          <span className="pt-1 font-bold">Help Center</span>
        </div>
        <div
          className="flex gap-2 cursor-pointer "
          onClick={() => {
            window.open("tel:+919496990907");
          }}
        >
          <FiPhoneCall size={27} color="black" />
          <span className="pt-1 font-bold "> Contact Us</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
