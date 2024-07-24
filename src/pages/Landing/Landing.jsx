import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../components/SessionContext";
import "./Landing.css";
import TopLogo from "../../images/TAQWA.png";
import { TbMenu2 } from "react-icons/tb";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import SideDrawer from "../../components/SideDrawer";
import SearchBar from "../../components/SearchBar";
import Like from "../../components/Like";
import { AiFillStar } from "react-icons/ai";
import supabase from "../../supabase";
import Clock from "../../components/clock";
import { useNavigate } from "react-router-dom";
import PlaceholderLoading from "react-placeholder-loading";

export const TopBar = ({ avatarInfo }) => {
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
      className="px-2 top-bar w-full h-20 flex justify-between items-center "
    >
      <div className="flex justify-start items-center w-full ">
        <TbMenu2
          size={25}
          onClick={() => {
            setOpen((prevOpen) => !prevOpen);
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
        onClick={() => {
          window.location.href = "/";
        }}
      />
      <div className="flex justify-end items-center w-full">
        <PiShoppingCartSimpleLight size={30} style={{ cursor: "pointer" }} />
      </div>
    </div>
  );
};
const ProductCard = ({ id, productName, rating, price, thumbnail }) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-[12em] sm:w-auto lg:max-w-[20em] h-fit product-card p-3 mb-3 bg-white rounded-lg flex flex-col"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        cursor: "pointer",
      }}
    >
      {!thumbnailLoaded && (
        <PlaceholderLoading shape="square" width={35} height={35} />
      )}
      <img
        src={thumbnail}
        alt={productName}
        className="w-35 h-35 object-cover rounded-sm"
        onLoad={() => setThumbnailLoaded(true)}
        style={{ display: thumbnailLoaded ? "block" : "none" }}
      />
      <div className="product-details mt-3 w-100 ">
        <div className="flex justify-between">
          <p className=" ">{productName}</p>
          <Like size="1em" />
        </div>
        <p
          style={{
            color: "#ff0054",
          }}
          className=" mt-1"
        >
          ₹ {price}
        </p>
        <span className="block mt-1 text-yellow-500">
          <span
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          >
            {Math.round(rating)}
          </span>

          <AiFillStar
            size={20}
            color="#ffdb00"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
            }}
          />
        </span>
      </div>
    </div>
  );
};
const CategoryCard = ({ index, category, thumbnail }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/search?category=${category}`);
  };
  return (
    <div
      className="category-item flex flex-col items-center justify-center flex-shrink-0 cursor-pointer transform transition-transform duration-150 active:scale-95"
      onClick={handleClick}
    >
      <img
        src={thumbnail}
        alt="Category Thumbnail"
        className="rounded-full w-[5em] h-[5em] object-cover"
      />
      <p className="category-name text-center">{category}</p>
    </div>
  );
};
export default function Landing() {
  const { session } = useContext(SessionContext);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const savedCategories = localStorage.getItem("categories");
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
        return;
      }

      const { data, error } = await supabase.from("categories").select("*");
      if (error) {
        console.log(error);
      } else {
        setCategories(data);

        localStorage.setItem("categories", JSON.stringify(data));
      }
    };

    const fetchNewArrivals = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) {
        console.log(error);
      } else {
        setNewArrivals(data);
        console.log(data);
      }
    };

    fetchNewArrivals();
    fetchCategories();
  }, []);
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[5em] ">
      <TopBar avatarInfo={session?.user.user_metadata} />
      <SearchBar />

      <h3 className="text-xl text-left ml-4 mt-10">Categories</h3>
      <div className="hide-scrollbar m-auto justify-around w-100 gap-1 flex flex-nowrap mt-5 overflow-x-scroll whitespace-nowrap ">
        {categories.map((category, index) => (
          <CategoryCard
            category={category.category}
            thumbnail={category.thumbnail}
            index={index}
            key={category.id}
          />
        ))}
      </div>

      <CardList title="New Arrivals" products={newArrivals} />
      <CardList title="Top Rated" products={newArrivals} />
      <CardList title="Best Sellers" products={newArrivals} />
    </div>
  );
}

export const CardList = ({ title, products }) => {
  return (
    <>
      <h3 className="text-xl text-left ml-4 mt-10">{title}</h3>
      <div className="min-h-[17em] m-auto justify-evenly w-100  flex flex-wrap mt-5 ">
        {products.map(
          (product) =>
            console.log(product.images[0]) || (
              <ProductCard
                id={product.id}
                productName={product.name}
                rating="4"
                price={product.price}
                thumbnail={product.images[0]}
                key={product.id}
              />
            )
        )}
      </div>
    </>
  );
};
