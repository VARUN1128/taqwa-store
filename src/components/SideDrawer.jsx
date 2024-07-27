import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { PiHeart } from "react-icons/pi";
import { IoBagCheckOutline } from "react-icons/io5";
import { VscAccount } from "react-icons/vsc";
import { GrAppsRounded } from "react-icons/gr";
import { GiConverseShoe } from "react-icons/gi";
import { PiSneakerMove } from "react-icons/pi";
import { GiWatch } from "react-icons/gi";
import Crocs from "../images/crocs.svg";
import { TbMenu2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const AccountRelatedItems = {
  "My Wishlist": {
    path: "/wishlist",
    icon: <PiHeart size={30} color="black" />,
  },
  "My Orders": {
    path: "/order",
    icon: <IoBagCheckOutline color="black" size={30} />,
  },
  "My Profile": {
    path: "/profile",
    icon: <VscAccount size={30} color="black" />,
  },
};

const CategoryItems = {
  "All Products": {
    path: "/search",
    icon: <GrAppsRounded size={30} color="black" />,
  },
  Shoes: {
    path: "/search?category=Shoes",
    icon: <PiSneakerMove size={30} color="black" />,
  },
  Converse: {
    path: "/search?category=converse",
    icon: <GiConverseShoe size={30} color="black" />,
  },
  Watches: {
    path: "/search?category=Watch",
    icon: <GiWatch size={30} color="black" />,
  },
  Crocs: {
    path: "/search?category=crocs",
    icon: (
      <div
        style={{
          width: "4em",
          height: "4em",
          marginLeft: "-0.8em",
          backgroundImage: `url(${Crocs})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    ),
  },
};

export default function SideDrawer({ name, profilePic, open, setOpen }) {
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    navigate(path);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 300 }} role="presentation" onClick={toggleDrawer(false)}>
      <TbMenu2
        size={25}
        onClick={() => {
          toggleDrawer(false);
        }}
        style={{ cursor: "pointer", marginLeft: "1em", marginTop: "2em" }}
      />
      <img
        src={profilePic}
        alt="avatar"
        style={{
          width: 60,
          borderRadius: "50%",
          margin: "auto",
          cursor: "pointer",
        }}
        onClick={() => navigate("/profile")}
      />
      <h2
        style={{
          textAlign: "center",
          fontFamily: "Product Sans",
          cursor: "pointer",
        }}
        onClick={() => navigate("/profile")}
      >
        {name}
      </h2>
      <List>
        {Object.entries(CategoryItems).map(([text, { path, icon }]) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => handleCategoryClick(path)}
          >
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  fontFamily: "Product Sans",
                  color: "black",
                }}
                primary={text}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {Object.entries(AccountRelatedItems).map(([text, { path, icon }]) => (
          <ListItem key={text} disablePadding onClick={() => navigate(path)}>
            <ListItemButton>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primary={text}
                primaryTypographyProps={{
                  fontFamily: "Product Sans",
                  color: "black",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer
        transitionDuration={500}
        open={open}
        onClose={toggleDrawer(false)}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
}
