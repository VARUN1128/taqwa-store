import React, { useState, useContext } from "react";
import { SessionContext } from "../../components/SessionContext";
import "./Landing.css";
import TopLogo from "../../images/TAQWA.png";
import { TbMenu2 } from "react-icons/tb";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import SideDrawer from "../../components/SideDrawer";

const TopBar = ({ avatarInfo }) => {
  const [open, setOpen] = useState(false);

  const userName = avatarInfo?.name.split(" ")[0] || "User";
  const avatarPic =
    avatarInfo?.avatar_url ||
    `https://api.dicebear.com/8.x/fun-emoji/png?seed=${userName}`;

  return (
    <div
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
      className="px-2 top-bar w-full h-20 flex justify-between items-center"
    >
      <div className="flex justify-start items-center w-full">
        <TbMenu2
          size={25}
          onClick={() => {
            setOpen(!open);
          }}
          style={{ cursor: "pointer" }}
        />
        <SideDrawer
          name={userName}
          profilePic={avatarPic}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <img
        src={TopLogo}
        alt="Taqwa Logo"
        className="h-10"
        style={{
          cursor: "pointer",
        }}
      />
      <div className="flex justify-end items-center w-full">
        <PiShoppingCartSimpleLight size={30} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
};
export default function Landing() {
  const { session } = useContext(SessionContext);

  return (
    <div className="page-landing">
      <TopBar avatarInfo={session?.user.user_metadata} />
      <h1>Landing Page</h1>
    </div>
  );
}
