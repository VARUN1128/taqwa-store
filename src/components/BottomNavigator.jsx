import React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { TbHome } from "react-icons/tb";
import { TbHomeFilled } from "react-icons/tb";
import { PiHeart } from "react-icons/pi";
import { PiHeartFill } from "react-icons/pi";
import { IoBagCheckOutline } from "react-icons/io5";
import { IoBagCheck } from "react-icons/io5";

export default function BottomNavigator({ avatarInfo }) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    const currentPage = window.location.pathname;
    if (currentPage === "/") {
      setValue(0);
    } else if (currentPage === "/wishlist") {
      setValue(1);
    } else if (currentPage === "/orders") {
      setValue(2);
    } else if (currentPage === "/profile") {
      setValue(3);
    } else {
      setValue(0);
    }
  }, []); // Empty dependency array means this effect runs once on mount
  const userName = avatarInfo?.name.split(" ")[0] || "User";
  const avatarPic =
    avatarInfo?.avatar_url ||
    `https://api.dicebear.com/8.x/fun-emoji/png?seed=${userName}`;

  return (
    <div className="bottom-nav">
      <Box sx={{ width: "100%" }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label={
              <span style={{ fontSize: 12, fontFamily: "Grifter" }}>Home</span>
            }
            icon={
              value === 0 ? <TbHomeFilled size={25} /> : <TbHome size={25} />
            }
          />
          <BottomNavigationAction
            label={
              <span style={{ fontSize: 12, fontFamily: "Grifter" }}>
                Wishlist
              </span>
            }
            icon={
              value === 1 ? (
                <PiHeartFill color="red" size={25} />
              ) : (
                <PiHeart color="red" size={25} />
              )
            }
          />
          <BottomNavigationAction
            label={
              <span style={{ fontSize: 12, fontFamily: "Grifter" }}>
                Orders
              </span>
            }
            icon={
              value === 2 ? (
                <IoBagCheck size={25} />
              ) : (
                <IoBagCheckOutline size={25} />
              )
            }
          />

          <BottomNavigationAction
            label={
              <span style={{ fontSize: 12, fontFamily: "Grifter" }}>
                {userName}
              </span>
            }
            icon={
              <img
                src={avatarPic}
                alt="avatar"
                style={{ width: 30, borderRadius: "50%" }}
              />
            }
          />
        </BottomNavigation>
      </Box>
    </div>
  );
}
