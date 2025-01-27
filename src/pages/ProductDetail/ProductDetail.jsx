import React, { useContext, useEffect, useState, useRef } from "react";
import { TopProductDetail } from "../../components/TopPageDetail";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Like from "../../components/Like";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import supabase from "../../supabase";
import { useParams } from "react-router-dom";
import Clock from "../../components/clock";
import { CardList } from "../Landing/Landing";
import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { SessionContext } from "../../components/SessionContext";
import { WishlistContext } from "../../components/WishlListContext";
import { useSelector, useDispatch } from "react-redux";
import { addItem, removeItem } from "../../components/cartSlice";
import { PiMinusCircleFill } from "react-icons/pi";
import { PiPlusCircleFill } from "react-icons/pi";
import { Helmet } from "react-helmet-async";
import { addSize } from "../../components/cartSlice";
import { PiStarFill } from "react-icons/pi";
import { HiBadgeCheck } from "react-icons/hi";
import { getRandomComments } from "../../components/DefaultComments";

const CommentComponent = ({ comment, userName, rating }) => {
  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const displayText = isReadMore ? comment.slice(0, 100) : comment;
  const isLongComment = comment.length > 100;

  return (
    <div className="bg-white w-[90%] ml-2 mb-5 ">
      <div
        style={{
          backgroundColor: "#03a685",
        }}
        className=" text-white inline-flex items-center px-2 py-1 rounded-xl"
      >
        <p className="text-md font-bold mr-1">{rating}</p>
        <PiStarFill size={12} className="inline-block" />
      </div>
      <div className="mt-3 text-md text-gray-700">
        <p className="">{displayText}</p>
        {isLongComment && (
          <span
            onClick={toggleReadMore}
            className="text-blue-500 cursor-pointer"
          >
            {isReadMore ? "...read more" : " show less"}
          </span>
        )}

        <div className="text-sm  text-gray-500">{userName}</div>
      </div>
    </div>
  );
};

const getContentType = async (url) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const contentType = response.headers.get("Content-Type");
    return contentType;
  } catch (error) {
    console.error("Error fetching content type:", error);
    return null;
  }
};

const Slideshow = ({ slideImages, rating }) => {
  const [mediaTypes, setMediaTypes] = useState({});
  const [tapped, setTapped] = useState(false);

  useEffect(() => {
    const fetchMediaTypes = async () => {
      const types = {};
      for (const url of slideImages) {
        const contentType = await getContentType(url);
        types[url] = contentType;
      }
      setMediaTypes(types);
    };

    fetchMediaTypes();
  }, [slideImages]);

  const getMediaType = (contentType) => {
    if (contentType.startsWith("image")) {
      return "image";
    } else if (contentType.startsWith("video")) {
      return "video";
    } else {
      return "unknown";
    }
  };

  //print user bearer token

  return (
    <div className="slide-container">
      <Slide indicators={true}>
        {slideImages.map((slideImage, index) => {
          const mediaType = getMediaType(mediaTypes[slideImage] || "");

          return (
            <div
              key={index}
              className="flex items-center justify-center bg-cover h-96 w-[96%] mx-auto rounded-lg bg-center bg-no-repeat mt-4 cursor-zoom-in lg:w-[30%] lg:h-[40em]  "
              style={{
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                position: "relative",
              }}
            >
              {mediaType === "image" && (
                <img
                  src={slideImage}
                  alt={`slide-${index}`}
                  className={`h-full w-full rounded-lg
                  ${tapped ? "object-contain" : "object-cover"}`}
                  onClick={() => setTapped(!tapped)}
                />
              )}
              <span className="absolute bottom-2 left-2 bg-white z-10 px-3 rounded-xl text-black d-flex align-items-center">
                {rating}
                <PiStarFill
                  size={20}
                  color="#03a685"
                  className="inline-block align-middle pb-1"
                />
              </span>{" "}
              {mediaType === "video" && (
                <video
                  className="h-full w-full object-contain rounded-lg"
                  controls
                >
                  <source src={slideImage} type={mediaTypes[slideImage]} />
                  Your browser does not support the video tag.
                </video>
              )}
              {mediaType === "unknown" && (
                <p className="text-white">Unsupported media type</p>
              )}
            </div>
          );
        })}
      </Slide>
    </div>
  );
};

const ProductDetail = () => {
  const [product, setProduct] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [relatedProducts, setRelatedProducts] = React.useState([]);
  const { session } = useContext(SessionContext);

  //-----Size Selection Functionality-----

  const [availableSizes, setavailableSizes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleSizeClick = (size) => {
    if (availableSizes.includes(size)) {
      setSelectedSize(size);
    } else {
      toast.error("This size is not available for this product yet!");
    }
  };

  //-----------------------------------
  const location = useLocation();
  const { productId } = useParams();

  const scroll = () => {
    const section = document.querySelector("#top");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Wishlist functionality
  const { wishlist, setWishlist } = useContext(WishlistContext);
  const isInWishlist = wishlist.includes(product.id);

  // Copy the URL to the clipboard

  const handleCopy = async () => {
    const url = window.location.origin + location.pathname;
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast(`Failed to copy the link. Please copy it manually: ${url}`);
    }
  };

  // Shopping cart functionality

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const productInCart = cartItems.find((item) => item.id === product.id);
  const quantity = productInCart ? productInCart.quantity : 0;
  const [localQuantity, setLocalQuantity] = useState(quantity);
  const [comments, setComments] = useState([]);
  const [categoryType, setCategoryType] = useState("");

  useEffect(() => {
    console.log("Random comments", comments);
  }, [comments]);
  useEffect(() => {
    if (product && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
      console.log("Test available sizes", availableSizes);
    }
  }, [availableSizes, productId]);
  useEffect(() => {
    const productInCart = cartItems.find(
      (item) => item.id === product.id && item.size === selectedSize
    );
    setLocalQuantity(productInCart ? productInCart.quantity : 0);
  }, [cartItems, product.id, selectedSize]);

  const handleAddToCart = () => {
    if (!selectedSize && availableSizes.length > 0) {
      console.log(availableSizes);
      availableSizes.length > 0 && toast.error("Please select a size first!");
      return;
    }

    if (categoryType.stock_map_required) {
      if (localQuantity >= product.stockMap[selectedSize]) {
        toast.error(
          `Available stock is ${product.stockMap[selectedSize]}. You already added ${localQuantity} items to the cart.`
        );
        return;
      }
    } else {
      if (localQuantity >= product.stock) {
        toast.error(
          `Available stock is ${product.stock}. You already added ${localQuantity} items to the cart.`
        );
        return;
      }
    }

    setLocalQuantity(quantity + 1);
    console.log(quantity, localQuantity);
    dispatch(addItem({ ...product, size: selectedSize }));
    dispatch(addSize({ id: product.id, size: selectedSize }));
  };

  const handleIncrement = (event) => {
    event.stopPropagation();
    if (categoryType.stock_map_required) {
      if (localQuantity >= product.stockMap[selectedSize]) {
        toast.error(
          `Available stock is ${product.stockMap[selectedSize]}. You already added ${localQuantity} items to the cart.`
        );
        return;
      }
    } else {
      if (localQuantity >= product.stock) {
        toast.error(
          `Available stock is ${product.stock}. You already added ${localQuantity} items to the cart.`
        );
        return;
      }
    }
    setLocalQuantity(quantity + 1);
    dispatch(addItem({ ...product, size: selectedSize }));
  };

  const handleDecrement = (event) => {
    event.stopPropagation();
    if (quantity > 0) {
      setLocalQuantity(quantity - 1);
      dispatch(removeItem({ ...product, size: selectedSize }));
      console.log("Decremented");
    }
  };

  useEffect(() => {
    setLocalQuantity(0);
    setSelectedSize(0);
    scroll();
  }, [productId]);

  const navigate = useNavigate();

  const handleBuyNow = () => {
    console.log("Handling");
    if (!selectedSize && availableSizes.length > 0) {
      toast.error("Please select a size first!");
      return;
    }

    if (categoryType.stock_map_required) {
      if (localQuantity < product.stockMap[selectedSize]) {
        dispatch(addItem({ ...product, size: selectedSize }));
      }
    } else {
      if (localQuantity < product.stock) {
        dispatch(addItem({ ...product, size: selectedSize }));
      }
    }

    dispatch(addSize({ id: product.id, size: selectedSize }));
    navigate("/cart");
  };

  //-----------------------------------

  //
  useEffect(() => {
    const fetchData = async () => {
      // Fetch product
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (productError) {
        console.log(productError);
        setIsLoading(false);
        return;
      }

      setProduct(productData);
      setavailableSizes(productData.available_sizes || []);
      setIsLoading(false);

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");
      if (categoriesError) {
        console.error("Error fetching categories: ", categoriesError);
      } else {
        setCategories(categoriesData);
        setCategoryType(
          categoriesData.find(
            (category) => category.category === productData.category
          )
        );
        console.log("This is the category", categoryType);
      }

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("ratings")
        .select("*")
        .eq("product_id", productId);

      if (commentsError) {
        console.log(commentsError);
      } else {
        if (commentsData.length > 0) {
          setComments(commentsData);
        } else {
          const randomComment = getRandomComments(
            productData.category,
            productId
          );
          setComments(randomComment);
        }
      }

      // Fetch related products
      const { data: relatedData, error: relatedError } = await supabase
        .from("products")
        .select("*")
        .limit(10)
        .order("category", { ascending: true })
        .neq("id", productData.id)
        .eq("category", productData.category);

      if (relatedError) {
        console.log(relatedError);
      } else {
        const randomProducts = [];
        for (let i = 0; i < 4 && relatedData.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * relatedData.length);
          randomProducts.push(relatedData[randomIndex]);
          relatedData.splice(randomIndex, 1);
        }
        setRelatedProducts(randomProducts);
      }
    };

    fetchData();
  }, [productId]);
  //-----------------------------------
  // Wishlist functionality

  const toggleWishlist = async () => {
    const id = product.id;
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

  // Image zoom functionality
  const [isCover, setIsCover] = useState(true);

  const handleImageClick = () => {
    setIsCover(!isCover);
  };

  if (isLoading) {
    return (
      <div className="page">
        <TopProductDetail title="Product Detail" />
        <div className="flex items-center justify-center h-[80vh]">
          <Clock />
        </div>
      </div>
    );
  }

  return (
    <div className="page overflow-x-hidden pb-[5em]">
      {product && (
        <Helmet>
          <title>{product.name} - TAQWA Fashion Store</title>
          <meta
            name="description"
            content={`Buy ${product.name} at the best price on TAQWA Fashion Store. Home Delivery and 100% satisfaction guaranteed.`}
          />
          <meta property="og:title" content={product.name} />
          <meta property="og:image" content={product.images[0]} />
          <meta property="og:url" content={window.location.href} />
        </Helmet>
      )}
      <TopProductDetail title={product.name} onCopy={handleCopy} />
      <ToastContainer />

      <div className="product-detail">
        {product.images.length === 1 ? (
          <div className="relative">
            <img
              src={product.images[0]}
              alt=""
              className={`w-[96%] m-auto rounded-lg mt-4 mb-3 h-96 cursor-zoom-in lg:w-[30%] lg:h-[35em] ${
                isCover ? "object-cover" : "object-contain"
              }`}
              style={{
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              }}
              onClick={handleImageClick}
            />
            <span className="absolute bottom-2 left-5 bg-white z-10 px-3 rounded-xl text-black d-flex align-items-center">
              {product.avg_rating}
              <PiStarFill
                size={20}
                color="#06d6a0"
                className="inline-block align-middle pb-1"
              />
            </span>{" "}
          </div>
        ) : (
          <Slideshow slideImages={product.images} rating={product.avg_rating} />
        )}

        <div className="product-details  w-full p-4 ">
          <div className="flex justify-between mb-3">
            <p className="text-2xl ">{product.name}</p>
            {session && (
              <Like
                checked={isInWishlist}
                size="2em"
                onClick={toggleWishlist}
              />
            )}
          </div>
          {product.brand && (
            <p className="text-lg text-gray-800 ">{product.brand}</p>
          )}
          <p className="text-sm text-gray-500 ">{product.category}</p>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            {product.category &&
              product.category === "Perfumes" &&
              product.prevMap && (
                <p
                  style={{
                    color: "black",
                    marginRight: "10px",
                    textDecoration: "line-through",
                    opacity: 0.8,
                  }}
                  className="mt-1 mb-3 text-lg"
                >
                  ₹ {product.prevMap[selectedSize]}
                </p>
              )}

            {product.category !== "Perfumes" && product.prev_price && (
              <p
                style={{
                  color: "black",
                  marginRight: "10px",
                  textDecoration: "line-through",
                  opacity: 0.8,
                }}
                className="mt-1 mb-3 text-lg"
              >
                ₹ {product.prev_price}
              </p>
            )}
            <p
              style={{
                color: "black",
                fontWeight: "bold",
                fontFamily: "Grifter",
              }}
              className="mt-1 mb-3 text-lg"
            >
              ₹{" "}
              {product.priceMap
                ? product.priceMap[selectedSize]
                : product.price}
            </p>

            {product.category === "Perfumes" && product.prevMap && (
              <div
                style={{
                  background: "black",
                  color: "white",
                  transform: "skew(-15deg)",
                  padding: "5px",
                  marginLeft: "10px",
                  fontFamily: "Grifter",
                  fontSize: "1em",
                  paddingBottom: "0",
                }}
              >
                {Math.round(
                  ((product.prevMap[selectedSize] -
                    product.priceMap[selectedSize]) /
                    product.prevMap[selectedSize]) *
                    100
                )}
                % OFF!
              </div>
            )}

            {product.category !== "Perfumes" &&
              product.prev_price &&
              product.prev_price > product.price && (
                <div
                  style={{
                    background: "black",
                    color: "white",
                    transform: "skew(-15deg)",
                    padding: "5px",
                    marginLeft: "10px",
                    fontFamily: "Grifter",
                    fontSize: "1em",
                    paddingBottom: "0",
                  }}
                >
                  {Math.round(
                    ((product.prev_price -
                      (product.priceMap
                        ? product.priceMap[selectedSize]
                        : product.price)) /
                      product.prev_price) *
                      100
                  )}
                  % OFF!
                </div>
              )}
          </div>
          <p
            style={{
              fontFamily: "Product Sans",
            }}
          >
            {product.description
              ? product.description
              : `Buy ${product.name} at only ₹${
                  product.priceMap
                    ? product.priceMap[selectedSize]
                    : product.price
                } from Taqwa Fashion Store Before it stocks out. ${
                  product.available_sizes && product.available_sizes.length > 0
                    ? "Available sizes are: " +
                      product.available_sizes.join(", ")
                    : ""
                } The product is rated ${
                  product.avg_rating
                } stars by our customers.`}
          </p>

          {product.category !== "Perfumes" && (
            <p
              className="text-sm text-gray-600 mt-2"
              style={{ fontFamily: "Product Sans" }}
            >
              *Note: This is a premium quality first-copy product. We are not
              associated with the original brand manufacturers. All brand names
              and trademarks are property of their respective owners and are
              used for reference purposes only.
            </p>
          )}
        </div>
        {categoryType.sizes && categoryType.sizes.length > 0 && (
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2 text-center"
              htmlFor="size"
            >
              Available Sizes
            </label>
            <div className="pb-2 flex flex-row justify-center align-middle items-center overflow-x-auto flex-wrap">
              {categories
                .find((category) => category.category === product.category)
                .sizes.map((size, index) => (
                  <div key={index} className="items-center m-2 relative">
                    <span
                      style={{
                        boxShadow: availableSizes.includes(size)
                          ? "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
                          : null,
                        fontSize: "0.8em",
                        outline: availableSizes.includes(size)
                          ? "0.05em solid black "
                          : "0.1em solid black ",
                      }}
                      className={`inline-block w-10 h-10 font-mono  flex items-center justify-center text-center rounded-full cursor-pointer ${
                        size === selectedSize
                          ? "bg-black text-white font-bold"
                          : availableSizes.includes(size)
                          ? "bg-gray-100 cursor-pointer "
                          : "bg-gray-300 cursor-wait opacity-30"
                      }`}
                      onClick={() => handleSizeClick(size)}
                      disabled={
                        !product.available_sizes ||
                        !product.available_sizes.includes(size)
                      }
                    >
                      {size}
                    </span>
                    {!availableSizes.includes(size) && (
                      <div className="absolute top-1/2 left-0 w-full transform rotate-45 border-t-[0.1em] border-black opacity-30"></div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
        <div>
          {categoryType.stock_map_required ? (
            product.stockMap && product.stockMap[selectedSize] > 0 ? (
              <>
                {/* Display buttons when stockMap has available stock */}
                <div className="product-action justify-center items-center w-full flex m-auto gap-3">
                  <div
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      transition: "transform 0.1s",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    }}
                    onClick={handleAddToCart}
                    className="px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
                  >
                    {localQuantity > 0 ? (
                      <>
                        <PiMinusCircleFill
                          size={20}
                          className="mr-3 inline-block align-middle z-10"
                          color="white"
                          onClick={handleDecrement}
                        />
                        {localQuantity}
                        <PiPlusCircleFill
                          size={20}
                          className="ml-3 inline-block align-middle z-10"
                          color="white"
                          onClick={handleIncrement}
                          style={{
                            display:
                              localQuantity >= product.stockMap[selectedSize]
                                ? "none"
                                : "inline",
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <PiShoppingCartSimpleLight
                          size={20}
                          className="mr-2 inline-block align-middle"
                          color="white"
                        />
                        Add to Cart
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      transition: "transform 0.1s",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                      border: "0.1em solid black",
                      textAlign: "center",
                    }}
                    onClick={handleBuyNow}
                    className="px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
                  >
                    <LiaRupeeSignSolid
                      size={21}
                      className="mr-2 inline-block align-middle"
                      color="black"
                      style={{
                        borderRadius: "50%",
                        padding: "0.2em",
                        backgroundColor: "black",
                        color: "white",
                      }}
                    />
                    Buy Item
                  </div>
                </div>
                {product.stockMap[selectedSize] < 10 && (
                  <div className="m-auto product-sans text-red-500 text-center mt-4">
                    Hurry Up! Only <b>{product.stockMap[selectedSize]}</b> left!
                  </div>
                )}
              </>
            ) : (
              // Sold out message if stockMap has no available stock
              <div
                className="product-action justify-center items-center w-full flex m-auto gap-3"
                style={{
                  color: "#ff0054",
                  fontFamily: "Product Sans",
                }}
              >
                <span>Product has been sold out. Please check back later.</span>
              </div>
            )
          ) : product.stock > 0 ? (
            <>
              {/* Display buttons when general stock is available */}
              <div className="product-action justify-center items-center w-full flex m-auto gap-3">
                <div
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    transition: "transform 0.1s",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }}
                  onClick={handleAddToCart}
                  className="px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
                >
                  {localQuantity > 0 ? (
                    <>
                      <PiMinusCircleFill
                        size={20}
                        className="mr-3 inline-block align-middle z-10"
                        color="white"
                        onClick={handleDecrement}
                      />
                      {localQuantity}
                      <PiPlusCircleFill
                        size={20}
                        className="ml-3 inline-block align-middle z-10"
                        color="white"
                        onClick={handleIncrement}
                        style={{
                          display:
                            localQuantity >= product.stock ? "none" : "inline",
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <PiShoppingCartSimpleLight
                        size={20}
                        className="mr-2 inline-block align-middle"
                        color="white"
                      />
                      Add to Cart
                    </>
                  )}
                </div>
                <div
                  style={{
                    backgroundColor: "white",
                    color: "black",
                    transition: "transform 0.1s",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                    border: "0.1em solid black",
                    textAlign: "center",
                  }}
                  onClick={handleBuyNow}
                  className="px-10 py-3 cursor-pointer rounded-lg active:transform active:scale-95 whitespace-nowrap text-sm sm:text-base"
                >
                  <LiaRupeeSignSolid
                    size={21}
                    className="mr-2 inline-block align-middle"
                    color="black"
                    style={{
                      borderRadius: "50%",
                      padding: "0.2em",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  />
                  Buy Item
                </div>
              </div>
              {product.stock < 10 && (
                <div className="m-auto product-sans text-red-500 text-center mt-4">
                  Hurry Up! Only <b>{product.stock}</b> left!
                </div>
              )}
            </>
          ) : (
            // Sold out message if general stock is unavailable
            <div
              className="product-action justify-center items-center w-full flex m-auto gap-3"
              style={{
                color: "#ff0054",
                fontFamily: "Product Sans",
              }}
            >
              <span>Product has been sold out. Please check back later.</span>
            </div>
          )}
          {!product.cod_price && !product.codPriceMap && (
            <div
              className="product-action justify-center items-center w-full flex m-auto gap-3 mt-2"
              style={{
                color: "#ff0054",
                fontFamily: "Product Sans",
                fontWeight: "bold",
              }}
            >
              <span>Cash On Delivery Not Available</span>
            </div>
          )}
        </div>
      </div>
      <div className=" mt-4 ">
        <h2 className="text-xl text-left ml-3 my-3 product-sans ">
          Customer Ratings
          <span
            className="assistant-bold  block"
            style={{
              color: "#03a685",
              fontSize: "0.6em",
            }}
          >
            <HiBadgeCheck size={20} className="inline-block mr-1 " />
            By Verified Buyers Only
          </span>
        </h2>
        <div
          className="rating"
          style={{
            display: "flex",
            justifyContent: "center",
            width: "50%",
            alignItems: "center",
            margin: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderRight: "1px solid #D3D3D3 ",
              paddingRight: "1em",
              marginRight: "1em",
            }}
          >
            <h1 className="text-7xl product-sans font-bold ">
              {product.avg_rating}
              {/* {(comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length).toFixed(1)} */}
            </h1>
            <PiStarFill color="#03a685" size={25} className="inline" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%", // Add width: "100%"
            }}
          >
            {[5, 4, 3, 2, 1].map((star) => {
              const commentsForStar = comments.filter(
                (comment) => (comment.rating || product.avg_rating) === star
              );
              const count = commentsForStar.length;
              const percentage = (count / comments.length) * 100;

              const progressBarClass =
                percentage >= 50
                  ? "pgreen"
                  : percentage >= 25
                  ? "porange"
                  : "pred";

              return (
                <div
                  key={star}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3em",
                    width: "100%",
                  }}
                >
                  <p className="product-sans">{star}</p>
                  <PiStarFill color="#03a685" />
                  <div className="progress-bar">
                    <div
                      className={`progress-bar-fill ${progressBarClass}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="product-sans">{count}</p>
                </div>
              );
            })}
          </div>
        </div>

        <h2 className="text-xl text-left ml-3 my-3 product-sans ">
          Customer Reviews{" "}
          <span className="assistant inline">
            ({comments.length > 0 ? comments.length : "3"})
          </span>
        </h2>

        {comments.map((comment, index) => (
          <CommentComponent
            key={index}
            comment={comment.comment}
            rating={comment.rating ? comment.rating : product.avg_rating}
            userName={comment.username}
          />
        ))}
      </div>
      {relatedProducts.length > 0 && (
        <CardList
          session={session}
          title="Related Products"
          products={relatedProducts}
        />
      )}
    </div>
  );
};

export default ProductDetail;
