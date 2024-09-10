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
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function BottomNavigator({ avatarInfo }) {
  const navigate = useNavigate();

  const location = useLocation();

  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const currentPage = location.pathname;
    if (currentPage === "/home") {
      setValue(0);
    } else if (currentPage === "/wishlist") {
      setValue(1);
    } else if (currentPage === "/orders") {
      setValue(2);
    } else if (currentPage === "/profile") {
      setValue(3);
    } else {
      setValue(null); // Set the value to null or some other default value
    }
  }, [location]); // Empty dependency array means this effect runs once on mount
  const userName = avatarInfo?.name.split(" ")[0] || "Account";
  const avatarPic =
    avatarInfo?.avatar_url ||
    `https://api.dicebear.com/9.x/adventurer/svg?mouth=variant23&seed=${userName}&eyebrows=variant10&skinColor=f2d3b1&backgroundColor=000000`;

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div
      className="bottom-nav"
      style={{
        zIndex: 1000,
      }}
    >
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
            onClick={() => navigate("/home")}
          />
          <BottomNavigationAction
            label={
              <span style={{ fontSize: 12, fontFamily: "Grifter" }}>
                Wishlist
              </span>
            }
            icon={
              value === 1 ? (
                <PiHeartFill color="#ff0054" size={25} />
              ) : (
                <PiHeart size={25} />
              )
            }
            onClick={() => navigate("/wishlist")}
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
            onClick={() => navigate("/orders")}
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
            onClick={() => navigate("/profile")}
          />
        </BottomNavigation>
      </Box>
    </div>
  );
}
