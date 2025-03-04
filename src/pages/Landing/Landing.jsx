import React, { useContext, useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { TbMenu2 } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectTotalQuantity } from "../../components/cartSlice";
import Like from "../../components/Like";
import SearchBar from "../../components/SearchBar";
import { SessionContext } from "../../components/SessionContext";
import SideDrawer from "../../components/SideDrawer";
import { WishlistContext } from "../../components/WishlListContext";
import TopLogo from "../../images/TAQWA.png";
import TaqwaBgLogo from "../../images/TAQWA_backgrounded.png";
import supabase from "../../supabase";
import ResponsiveContentLoader from "../../components/ResponseContentLoader";
import { Slide } from "react-slideshow-image";
import { PiHeart } from "react-icons/pi";
import "./Landing.css";
import { PiStarFill } from "react-icons/pi";
import SoldOut from "../../images/sold_out.png";
import axios from "axios";
import { IoIosLink } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import { FaWhatsapp, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";
const BACKEND_URL = process.env.REACT_APP_BACKEND_ORDER_URL;

const properties = {
  duration: 4000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: false,
  pauseOnHover: false,
  autoplay: true,
  easing: "ease",
};

const BannerSlideShow = ({ location }) => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("enabled", true)
        .eq("location", location);
      console.log("Slides", data);
      if (error) {
        console.log(error);
      } else {
        setBanners(data);
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (isLoading) {
    return (
      <div className=" w-[96%] h-[18em] m-auto rounded-md pb-2 lg:w-[80%] lg:h-[50em]">
        <ResponsiveContentLoader height="18em" />
      </div>
    );
  }

  return (
    <div className="slide-container ">
      <Slide {...properties}>
        {banners.map((banner, index) => (
          <div key={index} className="each-slide pb-2">
            <div
              className="rounded-md w-[99%] m-auto lg:w-[80%] h-[18em] lg:h-[50em]"
              style={{
                cursor: "pointer",
                backgroundImage: `url(${banner.image_url})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                // height: "18em",
                borderRadius: "10px",
                boxShadow:
                  "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
              }}
              onClick={() => {
                if (banner.offer_price) {
                  let goto = `/search?offer=under&value=${banner.offer_price}${
                    banner.category && `&category=${banner.category}`
                  }`;
                  navigate(goto);
                } else {
                  navigate("/home");
                }
              }}
            ></div>
          </div>
        ))}
      </Slide>
    </div>
  );
};

export const TopBar = ({ avatarInfo, showCopy }) => {
  const itemCount = useSelector(selectTotalQuantity);
  const [shine, setShine] = useState(false);

  const [open, setOpen] = useState(false);

  const userName =
    avatarInfo?.name != undefined ? avatarInfo.name.split()[0] : "User";
  const avatarPic =
    avatarInfo?.avatar_url ||
    `https://api.dicebear.com/9.x/adventurer/svg?mouth=variant23&seed=${userName}&eyebrows=variant10&skinColor=f2d3b1&backgroundColor=000000`;

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setShine((prevShine) => !prevShine);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      }}
      className="px-2 top-bar w-full h-16 flex justify-between items-center "
    >
      <ToastContainer />
      <div className="flex justify-start items-center w-full ">
        {/* <TbMenu2
          size={25}
          onClick={() => {
            setOpen((prevOpen) => !prevOpen);
          }}
          style={{ cursor: "pointer" }}
        /> */}
        {/* <SideDrawer
          name={userName}
          profilePic={avatarPic}
          open={open}
          setOpen={setOpen}
        /> */}
      </div>
      <div
        className={`flex justify-center items-center w-full relative ${
          shine ? "shine" : ""
        }`}
      >
        <img
          src={TopLogo}
          alt="Taqwa Logo"
          className="h-10"
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.href = "/home";
          }}
        />
      </div>
      <div className="flex justify-end items-center w-full relative gap-2">
        <IoIosLink
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigator.clipboard
              .writeText(window.location.href)
              .then(() => {
                toast.success("Link copied to clipboard!");
              })
              .catch(() =>
                toast.error("Failed to copy link! Please copy manually")
              );
          }}
        />
        <PiHeart
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/wishlist");
          }}
        />
        <PiShoppingCartSimpleLight
          size={30}
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate("/cart");
          }}
        />
        {itemCount > 0 && (
          <div
            className="absolute bg-black text-white rounded-full text-xs w-5 h-5 flex items-center justify-center cursor-pointer"
            style={{ fontSize: "0.6rem", top: "-5px", right: "-5px" }}
            onClick={() => {
              navigate("/cart");
            }}
          >
            {itemCount}
          </div>
        )}
      </div>
    </div>
  );
};
const ProductCard = ({
  id,
  productName,
  rating,
  price,
  thumbnail,
  session,
  prev_price,
  brand,
  category,
  stock,
  saveScrollPosition,
}) => {
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  const navigate = useNavigate();

  const { wishlist, setWishlist } = useContext(WishlistContext);
  const isInWishlist = wishlist.includes(id);

  const handleClick = () => {
    if (saveScrollPosition) {
      saveScrollPosition();
    }
    navigate(`/product/${id}#top`);
  };

  const toggleWishlist = async () => {
    // Optimistically update the UI
    if (isInWishlist) {
      setWishlist((oldWishlist) => oldWishlist.filter((item) => item !== id));
    } else {
      setWishlist((oldWishlist) => [...oldWishlist, id]);
    }

    // Then perform the network request in the background
    if (isInWishlist) {
      // Remove from wishlist
      const { data, error } = await supabase
        .from("wishlist")
        .delete()
        .match({ user_id: session.user.id, product_id: id });
      if (error) {
        console.log(error);
        // If the request fails, revert the UI update
        setWishlist((oldWishlist) => [...oldWishlist, id]);
      }
    } else {
      // Add to wishlist
      const { data, error } = await supabase
        .from("wishlist")
        .insert([{ user_id: session.user.id, product_id: id }]);
      if (error) {
        console.log(error);
        // If the request fails, revert the UI update
        setWishlist((oldWishlist) => oldWishlist.filter((item) => item !== id));
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        mb-2
        lg:mb-1
        bg-white
        flex
        flex-col
        justify-between
        w-[calc(50%-0.25rem)]
        cursor-pointer
        md:w-[calc(33%-0.25rem)]
        lg:w-[calc(25%-0.25rem)]
        xl:w-[calc(20%-0.25rem)]
        ${stock === 0 && thumbnailLoaded ? "hidden" : "flex"}
      `}
    >
      {!thumbnailLoaded && (
        <div className=" w-[96%] h-[20em] m-auto rounded-md pb-2 ">
          <ResponsiveContentLoader height="18em" />
        </div>
      )}

      <div className="relative prod-card">
        {stock === 0 && thumbnailLoaded && (
          <img src={SoldOut} className="absolute z-10" />
        )}
        <img
          src={thumbnail}
          alt={productName}
          className="w-35 h-35 object-cover "
          onLoad={() => {
            setTimeout(() => {
              setThumbnailLoaded(true);
            }, 1000);
          }}
          style={{
            display: thumbnailLoaded ? "block" : "none",
            filter:
              thumbnailLoaded && stock === 0
                ? "grayscale(100%) blur(1px)"
                : "none",
            msFilter:
              thumbnailLoaded && stock === 0
                ? "grayscale(100%) blur(1px)"
                : "none",
            WebkitFilter:
              thumbnailLoaded && stock === 0
                ? "grayscale(100%) blur(1px)"
                : "none",
          }}
        />
        <span className="absolute bottom-2 left-2 bg-white z-10 px-3 rounded-xl text-black d-flex align-items-center">
          {rating}
          <PiStarFill
            size={20}
            color="#03a685"
            className="inline-block align-middle pb-1"
          />
        </span>{" "}
      </div>

      <div
        className="product-details mt-3 w-100 p-2"
        style={{ display: thumbnailLoaded ? "block" : "none" }}
      >
        <div className="flex justify-between">
          <p className=" ">{productName}</p>
          {session && (
            <Like
              checked={isInWishlist}
              size="1.2em"
              onClick={toggleWishlist}
            />
          )}
        </div>
        {brand && <p className=" text-sm text-gray-600 ">{brand}</p>}
        {prev_price && category !== "Perfumes" && (
          <span
            style={{
              color: "black",
              marginRight: "10px",
              textDecoration: "line-through",
              opacity: 0.5,
            }}
            className="mt-1 mb-3 "
          >
            ₹ {prev_price}
          </span>
        )}
        <span
          style={{
            color: "black",
            fontFamily: "Grifter",
          }}
          className=" mt-1"
        >
          ₹ {price}
        </span>
        {prev_price &&
          prev_price > price &&
          !isNaN(Math.round(((prev_price - price) / prev_price) * 100)) && (
            <span
              style={{
                background: "black",
                color: "white",
                transform: "skew(-15deg)",
                padding: "5px",
                marginLeft: "10px",
                fontFamily: "Grifter",
                paddingBottom: "0",
                fontSize: "0.7em",
                display: "inline-block", // Add this line
              }}
            >
              {Math.round(((prev_price - price) / prev_price) * 100)}% OFF!
            </span>
          )}
      </div>
    </div>
  );
};

export const CategoryCard = ({ index, category, thumbnail, loading }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleClick = () => {
    navigate(`/search?category=${category}`);
  };

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.src = thumbnail;
    img.onload = () => {
      setIsLoading(false);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setIsLoading(false);
      setImageLoaded(false);
    };
  }, [thumbnail]);

  return (
    <div
      className="card category-item cursor-pointer transform transition-transform duration-150 active:scale-95 p-3 rounded-lg"
      onClick={handleClick}
      key={index}
    >
      {isLoading ? (
        <div className="w-[10em] h-[15em]">
          <ResponsiveContentLoader height="15em" />
        </div>
      ) : (
        <div className="relative w-[10em] h-[15em]">
          <img
            src={thumbnail}
            alt="Category Thumbnail"
            className="object-cover rounded-lg w-[10em] h-[15em]"
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "path/to/default/image.jpg";
            }}
          />
          <p
            style={{
              fontFamily: "Grifter",
              letterSpacing: "0.05em",
            }}
            className="category-name text-center mt-2 absolute bottom-1 left-2 text-white font-bold"
          >
            {category}
          </p>
        </div>
      )}
    </div>
  );
};
export default function Landing() {
  const { session } = useContext(SessionContext);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [mostWishlised, setMostWishlised] = useState([]);
  const [mostOrdered, setMostOrdered] = useState([]);

  useEffect(() => {
    console.log("pageNo", sessionStorage.getItem("currentPage"));
    sessionStorage.removeItem("currentPage");
    sessionStorage.removeItem("scrollPosition");
  }, []);
  useEffect(() => {
    const fetchCategories = async () => {
      const savedCategories = localStorage.getItem("categories");
      // if (savedCategories) {
      //   setCategories(JSON.parse(savedCategories));
      //   return;
      // }

      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("enabled", true)
        .order("id", { ascending: true });
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
        .eq("original", true)
        .limit(10);

      if (error) {
        console.log(error);
      } else {
        setNewArrivals(data);
        console.log("New arr", data);
      }
    };

    const fetchMostWishlisted = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/fetch-wishlisted`,
          { limit: 10 },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Most Wishlisted", response.data.data);
        setMostWishlised(response.data.data);
      } catch (error) {
        setMostWishlised([]);
        console.error(error);
      }
    };
    const fetchMostOrdered = async () => {
      const { data: wishlistData, error: wishlistError } = await supabase
        .from("wishlist")
        .select("product_id")
        .order("product_id", { ascending: true });

      if (wishlistError) {
        console.log(wishlistError);
      } else {
        const productIds = Array.from(
          new Set(wishlistData.map((item) => item.product_id))
        ).slice(0, 6);
        console.log("Wishlisted", productIds);
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("original", true)
          .in("id", productIds);

        if (productError) {
          console.log(productError);
        } else {
          console.log("Returned", productData);
          setMostOrdered(productData);
          console.log("Most Ordered", productData);
        }
      }
    };
    const fetchTopRated = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("avg_rating", { ascending: false })
        .eq("original", true)
        .limit(10);

      if (error) {
        console.log(error);
      } else {
        setTopRated(data);
      }
    };

    fetchNewArrivals();
    fetchCategories();
    fetchTopRated();
    fetchMostWishlisted();
    fetchMostOrdered();
  }, []);
  return (
    <div className="page overflow-y-auto hide-scrollbar pb-[10em] ">
      <TopBar avatarInfo={session?.user.user_metadata} />
      <SearchBar />

      <h3 className="text-xl lg:text-2xl lg:mt-2 text-left ml-4 mt-3 product-sans sub-titles lg:text-center ">
        Categories
      </h3>
      <div
        className="hide-scrollbar m-auto xl:flex xl:justify-center w-100  mt-5  scrolling-wrapper "
        style={{ width: "100%", padding: 0, margin: 0, border: 0 }}
      >
        {[...categories].map((category, index) => (
          <CategoryCard
            category={category.category}
            thumbnail={category.thumbnail}
            index={index}
            key={category.id}
          />
        ))}
      </div>

      <BannerSlideShow location="top" />

      <CardList title="New Arrivals" products={newArrivals} session={session} />
      <CardList title="Top Rated" products={topRated} session={session} />

      <BannerSlideShow location="bottom" />
      {/* 
      <CardList
        title="Most Wishlisted"
        products={mostWishlised}
        session={session}
      />
      <CardList title="Most Ordered" products={mostOrdered} session={session} /> */}

      <Footer />
    </div>
  );
}

export const CardList = ({ title, products, session, saveScrollPosition }) => {
  return (
    <>
      <h3 className="text-xl text-left ml-2 mt-2 product-sans sub-titles lg:text-center lg:text-2xl lg:mt-2">
        {title}
      </h3>
      <div className="flex flex-wrap flex-grow  justify-center  m-auto mt-5 card-contain lg:justify-evenly lg:m-auto  gap-1 lg:gap-0">
        {products.map((product) => (
          <ProductCard
            saveScrollPosition={saveScrollPosition}
            id={product.id}
            productName={product.name}
            rating={product.avg_rating}
            prev_price={product.prev_price}
            brand={product.brand}
            price={
              product.priceMap
                ? `${product.priceMap[Object.keys(product.priceMap)[0]]} -  ₹ ${
                    product.priceMap[Object.keys(product.priceMap).slice(-1)]
                  }`
                : product.price
            }
            thumbnail={product.images[0]}
            key={product.id}
            session={session}
            category={product.category}
            stock={product.stock}
          />
        ))}
      </div>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center md:items-start">
          <img src={TaqwaBgLogo} alt="Taqwa Logo" className="h-12 mb-4" />
          <p className="text-sm">
            © {new Date().getFullYear()} Taqwa. All Rights Reserved.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="font-semibold mb-2">Legal</h3>
          <a href="/terms" className="text-sm hover:text-gray-300">
            Terms & Conditions
          </a>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col items-center md:items-start space-y-3">
          <h3 className="font-semibold mb-2">Connect With Us</h3>

          <a
            href="https://instagram.com/taqwa_fashionstore_ekm"
            className="flex items-center space-x-2 hover:text-gray-300"
          >
            <FaInstagram />
            <span className="text-sm">@taqwa_fashionstore_ekm</span>
          </a>

          <a
            href="tel:+917558856844"
            className="flex items-center space-x-2 hover:text-gray-300"
          >
            <FaPhone />
            <span className="text-sm">+91 7558856844</span>
          </a>

          <a
            href="https://wa.me/917558856844"
            className="flex items-center space-x-2 hover:text-gray-300"
          >
            <FaWhatsapp />
            <span className="text-sm">WhatsApp Us</span>
          </a>

          <a
            href="mailto:taqwafashionstoreonline@gmail.com"
            className="flex items-center space-x-2 hover:text-gray-300"
          >
            <FaEnvelope />
            <span className="text-sm">taqwafashionstoreonline@gmail.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
